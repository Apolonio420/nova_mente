const express = require('express');
const cors = require('cors');
const connectMongo = require('./config/connectMongo');
const searchRoutes = require('./routes/searchRoutes'); // Nueva línea

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

app.post('/test', (req, res) => {
  console.log('Inside /test route');
  res.send('Test server route works');
});

app.use((req, res, next) => {
    console.log("Before search routes");
    next();
  });
  
  app.use('/api/search', searchRoutes); // Asegúrate de que sea '/api/search'
  
  app.use((req, res, next) => {
    console.log("After search routes");
    next();
  });
  
const PORT = 3002;
app.listen(PORT, () => {
  console.log(`Test server is running on port ${PORT}`);
});
