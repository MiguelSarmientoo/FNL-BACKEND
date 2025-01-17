const { Message } = require('../models');
const { Op, Sequelize } = require('sequelize');
const moment = require('moment-timezone');

const timeZone = 'America/Lima'; // Zona horaria de Perú

async function saveMessage(req, res) {
  const { content, userId } = req.body;
  const localDate = moment.tz(new Date(), timeZone); // Obtener la hora actual en la zona horaria local
  try {
    const message = await Message.create({
      content,
      user_id: userId,
      user_id_receptor: 1, // O el valor adecuado según tu lógica
      created_at: localDate.toDate() // Convertir el objeto moment a una fecha JavaScript
    });

    res.status(201).json({ message: 'Mensaje guardado correctamente.', data: message });
  } catch (error) {
    console.error('Error al guardar el mensaje:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
}

async function saveMessageFromBot(req, res) {
  const { content, userId } = req.body;
  const localDate = moment.tz(new Date(), timeZone); // Obtener la hora actual en la zona horaria local
  try {
    const message = await Message.create({
      content,
      user_id: 1, // El bot
      user_id_receptor: userId,
      created_at: localDate.toDate() // Convertir el objeto moment a una fecha JavaScript
    });

    res.status(201).json({ message: 'Mensaje guardado correctamente.', data: message });
  } catch (error) {
    console.error('Error al guardar el mensaje del bot:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
}

const getFilteredMessages = async (req, res) => {
  const userId = parseInt(req.query.userId);
  const limit = parseInt(req.query.limit) || 20;  // Número de mensajes por lote
  const offset = parseInt(req.query.offset) || 0; // Desplazamiento inicial

  try {
    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { user_id: userId, user_id_receptor: 1 },
          { user_id: 1, user_id_receptor: userId }
        ]
      },
      order: [['created_at', 'DESC']],
      limit,
      offset
    });

    const messagesWithLocalTime = messages.map(message => {
      const utcDate = moment.utc(message.created_at);
      const zonedDate = utcDate.tz(timeZone);
      return {
        ...message.toJSON(),
        created_at: zonedDate.format('YYYY-MM-DD HH:mm:ss')
      };
    });

    res.status(200).json(messagesWithLocalTime);
  } catch (error) {
    console.error('Error fetching filtered messages:', error);
    res.status(500).json({ error: 'Error fetching filtered messages' });
  }
};

const getAllMessages = async (req, res) => {
  try {
    const messages = await Message.findAll();
    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Error fetching messages' });
  }
}
const promedioScore = async (req, res) => {
  try {
    const { userId } = req.params; 
    const promedioSemana = await Message.findAll({
      attributes: [
        [Sequelize.fn('YEARWEEK', Sequelize.col('created_at')), 'week'],
        [Sequelize.fn('AVG', Sequelize.col('score')), 'promedio_estres']
      ],
      where: {
        user_id: userId, 
      },
      group: ['week'], 
      order: [['week', 'ASC']], 
    });

    const result = promedioSemana.map(entry => ({
      semana: entry.dataValues.week,
      promedio_estres: parseFloat(entry.dataValues.promedio_estres)
    }));

    return res.status(200).json(result);
  } catch (error) {
    console.error('Error al calcular el promedio semanal:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = {
  saveMessage,
  getAllMessages,
  getFilteredMessages,
  saveMessageFromBot,
  promedioScore
};
