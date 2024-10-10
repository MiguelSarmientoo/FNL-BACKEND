const express = require('express');
const router = express.Router();
const openaiController = require('../controllers/openaiController');

router.post('/ask', async (req, res) => {
  const { prompt, userId } = req.body;
  try {
    const response = await openaiController.getBotResponse(prompt, userId);
    res.json({ response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
