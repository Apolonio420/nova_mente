const express = require('express');
const router = express.Router();
const { optimizePromptForTShirt, generateImageFromPrompt } = require('../util/openAIHelper');

router.post('/generate-image-helped', async (req, res) => {
  try {
    const { description, style } = req.body;
    const optimizedPrompt = await optimizePromptForTShirt(description, style);
    if (!optimizedPrompt) {
      throw new Error('No se pudo optimizar el prompt');
    }
    const imageUrl = await generateImageFromPrompt(optimizedPrompt);
    res.json({ imageUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
