const mongoose = require('mongoose');
const User = require('../models/User');  // Asegúrate de que la ruta sea correcta

// Conexión a MongoDB
mongoose.connect('mongodb+srv://codeduostudios:YKCbGRPp3fIaPCuD@novamente.pibypbv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Conectado a MongoDB');
})
.catch(err => {
  console.error('Error al conectar a MongoDB:', err);
});

// Añadir un usuario de ejemplo
const addTestUser = async () => {
  const testUser = new User({
    email: 'test@example.com',
    password: 'testpassword'  // En un entorno real, asegúrate de hashear la contraseña
  });

  try {
    const savedUser = await testUser.save();
    console.log('Usuario de prueba añadido:', savedUser);
    mongoose.connection.close();
  } catch (err) {
    console.error('Error al añadir el usuario de prueba:', err);
    mongoose.connection.close();
  }
};

// Ejecutar la función
addTestUser();
