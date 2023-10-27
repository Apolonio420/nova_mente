const express = require('express');
const router = express.Router();
const processUserQuery = require('../util/openAIHelper').processUserQuery;

// Suponiendo que tienes un middleware para verificar el usuario
// const verifyUser = require('../middlewares/authMiddleware').verifyUser;

router.post('/search', async (req, res) => {
  try {
    const userQuery = req.body.query;
    const userId = req.body.userId; // Puedes obtener esto del token JWT si estás usando autenticación

    const result = await processUserQuery(userQuery, userId);

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
