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

const { runAssistant, generateImageWithDalle } = require('./util/openAIHelper');
// Endpoint para optimizar prompts y generar imágenes
app.post('/api/optimize-and-generate', async (req, res) => {
  const { prompt } = req.body;
  
  console.log("Recibido en el backend:", prompt); // Mostrar el prompt recibido

  try {
    const optimizedPrompts = await runAssistant(assistantId, prompt);
    const optimizedPrompt = optimizedPrompts[0];

    console.log("Prompt optimizado:", optimizedPrompt); // Mostrar el prompt optimizado

    const imageUrl = await generateImageWithDalle(optimizedPrompt);

    console.log("URL de la imagen:", imageUrl); // Mostrar la URL de la imagen generada

    res.json({ imageUrl });
  } catch (error) {
    console.error("Error en la optimización y generación de imagen:", error);
    res.status(500).send("Error en el proceso.");
  }
});



app.post('/api/generate-image', async (req, res) => {
  const prompt = req.body.prompt;
  try {
    const imageUrl = await openAIHelper.generateImageWithDalle(prompt);
    res.json({ imageUrl });
  } catch (error) {
    console.error("Error al generar imagen con DALL-E:", error);
    res.status(500).send("Error al generar imagen.");
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
