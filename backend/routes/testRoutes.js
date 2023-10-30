const express = require('express');
const router = express.Router();

router.post('/test', async (req, res) => {
  console.log("Inside /api/test route");
  res.send("Test route works");
});

module.exports = router;
