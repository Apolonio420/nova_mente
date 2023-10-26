const express = require('express');
const mongoose = require('mongoose');
const searchRoutes = require('./routes/searchRoutes');  // Importamos el nuevo archivo de rutas

// Conexión a MongoDB
const connectMongo = require('./config/connectMongo');
connectMongo();

const app = express();

// Middlewares y configuraciones adicionales aquí (si los hay)

// Montamos las rutas de búsqueda
app.use('/api/search', searchRoutes);

// Iniciamos el servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
