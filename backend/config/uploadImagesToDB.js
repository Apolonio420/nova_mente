const connectDB = require('./connectMongo'); // Asegúrate de que esta es la ruta correcta a tu archivo connectMongo.js
const fs = require('fs');
const Image = require('../models/Image'); // Importa tu modelo Image

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

    // Iterar sobre las imágenes y guardarlas en la base de datos
    for (const image of images) {
        const newImage = new Image({
            imageUrl: image.imageUrl,  // Cambia 'url' a 'imageUrl' para que coincida con la clave en tu JSON
            description: image.description,
          });
      await newImage.save();
    }

    console.log('Todas las imágenes se han guardado exitosamente.');
  } catch (error) {
    console.error('Error al guardar las imágenes:', error);
  } finally {
    // Cerrar la conexión a la base de datos
    // Se omite esta parte ya que la conexión se maneja en connectMongo.js
  }
});
