const connectDB = require('./connectMongo');
const fs = require('fs');
const Image = require('../models/Image');
const path = require('path');

async function uploadImagesToDB() {
  await connectDB();

  const jsonPath = path.join(__dirname, 'imagenes.json');
  const data = fs.readFileSync(jsonPath, 'utf8');
  const images = JSON.parse(data);

  for (const image of images) {
    const newImage = new Image({
      imageUrl: image.imageUrl,
      description: image.description,
      niche: image.niche // Utiliza el campo niche
    });

    await newImage.save();
  }

  console.log('Todas las imágenes se han guardado exitosamente en la base de datos.');
}

uploadImagesToDB().catch(console.error);
