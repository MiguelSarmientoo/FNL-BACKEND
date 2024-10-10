const axios = require('axios');
require('dotenv').config();

const { Message, User } = require('../models');
const { Op } = require('sequelize');

const countTokens = (text) => {
  return text.split(' ').length; // Estimación simple, no exacta
};

const getBotResponse = async (prompt, userId) => {
  const apiKey = process.env.OPENAI_API_KEY; 
  const url = 'https://api.openai.com/v1/chat/completions';
  const MAX_TOKENS = 100; // Máximo de tokens para la respuesta

  if (!prompt || typeof prompt !== 'string') {
    throw new Error('Invalid prompt');
  }

  try {
    // Obtener el usuario por userId para obtener el username
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    
    const username = user.username; // Obtiene el username

    // Obtener historial de mensajes del usuario
    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { user_id: userId, user_id_receptor: 1 },
          { user_id: 1, user_id_receptor: userId }
        ]
      },
      order: [['created_at', 'ASC']]
    });

    // Imprimir los mensajes obtenidos
    console.log('Mensajes obtenidos:', messages);

    // Convertir historial de mensajes a formato adecuado para OpenAI
    const chatHistory = messages.map(msg => ({
      role: msg.user_id === userId ? 'user' : 'assistant',
      content: msg.content
    }));

    // Imprimir el historial de chat
    console.log('Historial de chat formateado:', chatHistory);

    // Agregar el prompt actual al historial
    chatHistory.push({ role: 'user', content: prompt });

    // Configurar el mensaje del sistema
    const systemMessage = {
      role: 'system',
      content: `
        Tu nombre es Funcy. Eres un asistente de IA con un enfoque psicológico altamente profesional, especializado en el manejo del estrés y en brindar orientación emocional a empleados. Actúas con empatía, comprensión y siempre adoptas un tono profesional y sereno.
    
        Cada respuesta debe estar basada en técnicas psicológicas comprobadas y siempre ofrecer orientación práctica y relevante para reducir el estrés. Tus respuestas deben ser detalladas, claras y fáciles de comprender.

        Recuerda: Te dirigirás a ${username} por su nombre. Si el usuario menciona estrés laboral o emocional, debes ofrecer recursos y consejos para mejorar su bienestar mental, evitando el uso de recursos gráficos.
      `
    };

    // Limitar el historial para no exceder el límite de tokens
    let totalTokens = countTokens(systemMessage.content);
    const limitedChatHistory = [];

    for (let i = chatHistory.length - 1; i >= 0; i--) {
      const messageTokens = countTokens(chatHistory[i].content);
      if (totalTokens + messageTokens + MAX_TOKENS <= 4096) { // Incluye margen para la respuesta
        limitedChatHistory.unshift(chatHistory[i]);
        totalTokens += messageTokens;
      } else {
        break;
      }
    }

    // Mensaje de éxito para la lectura del historial
    console.log('Historial leído correctamente:', limitedChatHistory);

    // Enviar todo el historial limitado y el mensaje del sistema en una sola solicitud
    const response = await axios.post(
      url,
      {
        model: 'gpt-4',
        messages: [systemMessage, ...limitedChatHistory],
        max_tokens: 1000,  // Permitir respuestas más largas
        temperature: 0.2,  // Respuestas más coherentes y precisas
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
      }
    );
    
    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error al obtener respuesta del bot:', error.response?.data || error.message);
    throw new Error(`Error al obtener respuesta del bot: ${error.response?.data?.error?.message || error.message}`);
  }
};

module.exports = { getBotResponse };
