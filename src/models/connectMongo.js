const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://codeduostudios:Lunita420.@novamente.pibypbv.mongodb.net/myDatabase', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Conexión a MongoDB exitosa');
})
.catch((err) => {
    console.error('Error al conectar a MongoDB:', err);
});
