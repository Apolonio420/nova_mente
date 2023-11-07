const connectDB = require('../config/connectMongo'); // Asegúrate de que esta es la ruta correcta
const mongoose = require('mongoose'); // Requiere mongoose aquí
const Image = require('../models/Image'); // Asegúrate de que la ruta del modelo Image es correcta

// Conectarse a la base de datos
connectDB().then(async () => {
  try {
    // Eliminar todas las imágenes
    await Image.deleteMany({});
    console.log('Todas las imágenes han sido eliminadas.');
  } catch (error) {
    console.error('Error al eliminar las imágenes:', error);
  }
  // Cerrar la conexión a la base de datos
  mongoose.connection.close();
});
