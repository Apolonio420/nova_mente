const mongoose = require('mongoose');

// Utiliza variables de entorno para la cadena de conexión y opciones
const connectionString = process.env.MONGODB_URI;

// Opciones de conexión
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

async function connectDB() {
  try {
    await mongoose.connect(connectionString, options);
    console.log('Conexión exitosa a MongoDB');
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error);
  }
}

connectDB();

module.exports = connectDB;
