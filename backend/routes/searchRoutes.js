const express = require('express');
const router = new express.Router();
// const processUserQuery = require('../util/openAIHelper').processUserQuery; // Comentado por ahora

// Ruta de prueba
router.get('/test', (req, res) => {
  console.log("Petición recibida en /test");
  res.send("Test route is working");
});

// Middleware de prueba antes de /search
router.use('/search', (req, res, next) => {
  console.log("Middleware de prueba antes de /search");
  next();
});

// Nueva ruta POST para '/search'
router.post('/', async (req, res) => {
  try {
    const userQuery = req.body.query;
    const userId = req.body.userId;

    // Aquí puedes procesar la consulta del usuario y realizar las operaciones necesarias
    // ...

    // Devolver una respuesta
    res.status(200).json({
      success: true,
      message: 'Tu mensaje aquí'
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// Ruta POST para '/test'
router.post('/test', async (req, res) => {
  console.log("Petición recibida en /test");
  
  try {
    const userQuery = req.body.query;
    const userId = req.body.userId;
    
    console.log("Processing user query:", userQuery, "for user:", userId);
    
    // Comentando la llamada a processUserQuery por ahora
    // const result = await processUserQuery(userQuery, userId);
    
    // Simulando un resultado
    const result = {
      images: ["image1", "image2"],
      creativePrompts: ["Prompt 1", "Prompt 2"]
    };
    
    console.log("Result:", result);

    res.status(200).json({
      success: true,
      images: result.images,
      creativePrompts: result.creativePrompts
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

module.exports = router;
