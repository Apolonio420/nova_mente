const mongoose = require('mongoose');
const Image = require('./Image');  // Asegúrate de que la ruta sea correcta

// Conectar a MongoDB
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

const searchImages = async (query) => {
  // Realizar la búsqueda de texto en MongoDB
  const images = await Image.find(
    { $text: { $search: query } },
    { score: { $meta: "textScore" } }
  )
  .sort({ score: { $meta: "textScore" } })
  .limit(5);

  return images;
};

// Usar la función para buscar imágenes
const testQuery = "shark";  // Reemplaza esto con tu propia consulta de prueba
searchImages(testQuery)
  .then(images => {
    console.log('Imágenes encontradas:', images);
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('Error al realizar la búsqueda:', err);
    mongoose.connection.close();
  });
