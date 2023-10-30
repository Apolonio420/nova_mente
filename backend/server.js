const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const searchRoutes = require('./routes/searchRoutes');
const testRoutes = require('./routes/testRoutes');  // Nueva línea

const connectMongo = require('./config/connectMongo');
connectMongo();

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204
}));

app.use(express.json());

app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

app.use('/api/search', searchRoutes);
app.use('/api/test', testRoutes);  // Nueva línea

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Search route should be available at http://localhost:${PORT}/api/search`);
  console.log(`Test route should be available at http://localhost:${PORT}/api/test`);  // Nueva línea
});
