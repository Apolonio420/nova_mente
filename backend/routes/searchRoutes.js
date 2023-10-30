const express = require('express');
const router = new express.Router();
// const processUserQuery = require('../util/openAIHelper').processUserQuery; // Comentado por ahora

// Ruta de prueba
router.get('/test', (req, res) => {
  console.log("Petición recibida en /test");
  res.send("Test route is working");
});

router.use('/search', (req, res, next) => {
  console.log("Middleware de prueba antes de /search");
  next();
});

router.post('/test', async (req, res) => {
  console.log("Petición recibida en /test");
  
  try {
    console.log("Dentro del bloque try en /test");
    
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
