const mongoose = require('mongoose');
const Image = require('./models/Image');  // Asegúrate de que la ruta sea correcta

// Conectar a MongoDB
mongoose.connect('mongodb+srv://codeduostudios:YKCbGRPp3fIaPCuD@novamente.pibypbv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Conectado a MongoDB');
  
  // Intentar asegurar los índices
  return Image.ensureIndexes();
})
.then(() => {
  console.log('Índices asegurados con éxito');
  mongoose.connection.close();
})
.catch(err => {
  console.error('Error:', err);
  mongoose.connection.close();
});
