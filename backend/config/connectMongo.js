const mongoose = require('mongoose');

// Tu cadena de conexión de MongoDB Atlas
const connectionString = 'mongodb+srv://codeduostudios:YKCbGRPp3fIaPCuD@novamente.pibypbv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

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
    // Reintentar la conexión en caso de fallo
    setTimeout(connectDB, 5000);
  }
}

connectDB();

module.exports = connectDB;
