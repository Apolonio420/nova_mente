const connectDB = require('./connectMongo');
const fs = require('fs');
const axios = require('axios');
const Image = require('../models/Image');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });


// Función para obtener el embedding de OpenAI
async function getEmbeddingForDescription(description) {
  try {
    const response = await axios.post('https://api.openai.com/v1/embeddings', {
      model: "text-embedding-ada-002", // Utilizamos el modelo adecuado
      input: description
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    // Aquí asumimos que la respuesta contiene un array con los embeddings y tomamos el primero
    return response.data.data[0].embedding; 
  } catch (error) {
    console.error('Error al obtener el embedding:', error);
    throw error;
  }
}

async function uploadImagesToDB() {
  await connectDB();

  const jsonPath = path.join(__dirname, 'imagenes.json');
  const data = fs.readFileSync(jsonPath, 'utf8');
  const images = JSON.parse(data);

  for (const image of images) {
    // Obtener el embedding para la descripción de la imagen
    const embedding = await getEmbeddingForDescription(image.description);

    const newImage = new Image({
      imageUrl: image.imageUrl,
      description: image.description,
      niche: image.niche,
      embedding: embedding // Añadimos el embedding al documento
    });

    await newImage.save();
  }

  console.log('Todas las imágenes se han guardado exitosamente en la base de datos con sus embeddings.');
}

uploadImagesToDB().catch(console.error);
