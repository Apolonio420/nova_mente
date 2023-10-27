const connectDB = require('./connectMongo'); // Asegúrate de que esta es la ruta correcta a tu archivo connectMongo.js
const fs = require('fs');
const AWS = require('aws-sdk');
const Image = require('../models/Image'); // Importa tu modelo Image

// Configura AWS
AWS.config.update({
  accessKeyId: 'AKIAVWKDZK4OYSTDSE4C',
  secretAccessKey: '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',
  region: 'sa-east-1'
});

const s3 = new AWS.S3();

// Leer archivo JSON
fs.readFile('./imagenes1.json', 'utf8', async (err, data) => {
  if (err) {
    console.error('Error al leer el archivo:', err);
    return;
  }

  const images = JSON.parse(data);

  try {
    // Conectar a la base de datos
    await connectDB();

    // Iterar sobre las imágenes
    for (const image of images) {
      const fileContent = fs.readFileSync(image.imageUrl);

      // Parámetros para S3
      const params = {
        Bucket: 'novamente42',
        Key: image.description + '.jpg', // o '.png'
        Body: fileContent,
        ContentType: 'image/jpeg', // o 'image/png'
        ACL: 'public-read'
      };

      // Subir imagen a S3
      const uploaded = await s3.upload(params).promise();

      // Crear nuevo registro en MongoDB
      const newImage = new Image({
        imageUrl: uploaded.Location,
        description: image.description,
      });

      await newImage.save();
    }

    console.log('Todas las imágenes se han guardado exitosamente.');
  } catch (error) {
    console.error('Error al guardar las imágenes:', error);
  }
});
