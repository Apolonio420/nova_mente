require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const Image = require('../models/Image');
const connectDB = require('./connectMongo');
connectDB();
const { CohereClient } = require('cohere-ai');
const fs = require('fs');
const path = require('path');

if (!process.env.COHERE_API_KEY) {
    console.error('La clave API de Cohere no está definida. Por favor, verifica tu archivo .env');
    process.exit(1);
}

const cohere = new CohereClient({ token: process.env.COHERE_API_KEY });
const imagesData = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'imagenes.json'), 'utf8'));

async function getEmbeddings(description) {
  try {
      const response = await cohere.embed({ texts: [description] });
      
      // Registrar toda la respuesta para depurar
      console.log("Respuesta completa de Cohere:", JSON.stringify(response, null, 2));

      if (response.body && response.body.embeddings && response.body.embeddings.length > 0) {
        return response.body.embeddings[0];
    } else {
        console.error("No se pudo obtener el embedding para la imagen:", response);
        return null;
    }
    
  } catch (err) {
      console.error("Error al obtener embeddings:", err);
      return null;
  }
}


async function uploadImages() {
    for (let image of imagesData) {
        console.log(`Procesando descripción: ${image.description}`);
        const embedding = await getEmbeddings(image.description);
        if (embedding) {
            const newImage = new Image({
                url: image.url,
                description: image.description,
                embedding: embedding
            });

            try {
                await newImage.save();
                console.log(`Imagen guardada en la base de datos: ${image.url}`);
            } catch (err) {
                console.error(`Error al guardar la imagen en la base de datos: ${err}`);
            }
        } else {
            console.error(`No se pudo obtener el embedding para la imagen: ${image.url}`);
        }
    }
}

uploadImages();
