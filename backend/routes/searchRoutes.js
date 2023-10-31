const express = require('express');
const router = new express.Router();
const { processUserQuery } = require('../util/openAIHelper'); // Importar la función processUserQuery

router.post('/', async (req, res) => {
  try {
    const userQuery = req.body.query;
    const userId = req.body.userId;

    // Obtener las imágenes y prompts creativos usando processUserQuery
    const { images, creativePrompts } = await processUserQuery(userQuery, userId);

    res.status(200).json({ success: true, images, creativePrompts });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

module.exports = router;
