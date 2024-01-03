require('dotenv').config({ path: '../.env' });
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const searchRoutes = require('./routes/searchRoutes');
const testRoutes = require('./routes/testRoutes');
const openAIHelper = require('./util/openAIHelper');

const app = express();

// Configuración de CORS
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
app.use('/api/test', testRoutes);

// ID del asistente desde .env
const assistantId = process.env.ASSISTANT_ID;

// Endpoint para optimizar prompts
app.post('/api/optimize-prompt', async (req, res) => {
  const userPrompt = req.body.prompt;
  try {
    const responses = await openAIHelper.runAssistant(assistantId, userPrompt);
    res.json({ responses });
  } catch (error) {
    console.error("Error al optimizar el prompt:", error);
    res.status(500).send("Error al procesar el prompt.");
  }
});

const PORT = process.env.PORT || 3001;

// Conectar a MongoDB y luego iniciar el servidor
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Conexión exitosa a MongoDB');
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Endpoints disponibles: http://localhost:${PORT}/api/search, http://localhost:${PORT}/api/test, http://localhost:${PORT}/api/optimize-prompt`);
  });
})
.catch(err => {
  console.error('Error al conectar a MongoDB:', err);
});
