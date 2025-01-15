const express = require("express");
const router = express.Router();
const openaiController = require("../controllers/openaiController");
const { Message } = require("../models");
const { Op } = require("sequelize");

//Analisis de mensaje
async function analisisMensaje(mensaje, userId) {
  const response = await openaiController.analyzeMessage(mensaje);

  const message = await Message.findOne({
    where: {
      [Op.and]: [{ user_id: userId, user_id_receptor: 1 }],
    },
    order: [["created_at", "DESC"]],
  });

  message["sentimientos"] = response["sentimiento"];
  message["factor_psicosocial"] = response["factor_psicosocial"];
  message["score"] = response["score"];
  message["message_length"] = response["message_length"];
  await message.save();
  return response;
}

//Funcion para chats
router.post("/ask", async (req, res) => {
  const { prompt, userId } = req.body;
  try {
    analisisMensaje(prompt, userId);
    const response = await openaiController.getBotResponse(prompt, userId);
    res.json({ response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
