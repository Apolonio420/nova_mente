const express = require('express');
const { processUserQuery } = require('../util/openAIHelper');
const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    const { query, userId } = req.body;
    const result = await processUserQuery(query, userId);
    res.json(result);
  } catch (error) {
    console.error('Error en searchRoutes:', error);
    next(error);
  }
});

module.exports = router;

