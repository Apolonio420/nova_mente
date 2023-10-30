const express = require('express');
const { processUserQuery } = require('../util/openAIHelper');  // Asegúrate de que la ruta sea correcta
const router = new express.Router();

router.get('/test', (req, res) => {
  console.log("Petición recibida en /test");
  res.send("Test route is working");
});

router.use('/search', (req, res, next) => {
  console.log("Middleware de prueba antes de /search");
  next();
});

router.post('/', async (req, res) => {
  try {
    const userQuery = req.body.query;
    const userId = req.body.userId;
    res.status(200).json({success: true, message: 'Tu mensaje aquí'});
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

router.post('/test', async (req, res) => {
  console.log("Petición recibida en /test");
  try {
    const userQuery = req.body.query;
    const userId = req.body.userId;
    console.log("Processing user query:", userQuery, "for user:", userId);
    
    // Usa solo una de las siguientes líneas, no ambas
    const result = await processUserQuery(userQuery, userId);
    // const result = {images: ["image1", "image2"], creativePrompts: ["Prompt 1", "Prompt 2"]};
    
    console.log("Result:", result);
    res.status(200).json({success: true, images: result.images, creativePrompts: result.creativePrompts});
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

module.exports = router;
