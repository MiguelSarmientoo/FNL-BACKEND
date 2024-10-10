const UserResponse = require('../models/user_responses'); // Asegúrate de importar correctamente tu modelo de UserResponse
const moment = require('moment-timezone');
const timeZone = 'America/Lima'; // Zona horaria de Perú

// Función para guardar la respuesta del usuario
const saveUserResponse = async (req, res) => {
    const {
      user_id,
      age_range_id,
      hierarchical_level_id,
      responsability_level_id,
      gender_id,
      created_at
    } = req.body;
  
    try {
      const userResponse = await UserResponse.create({
        user_id,
        age_range_id,
        hierarchical_level_id,
        responsability_level_id,
        gender_id,
        created_at
      });
  
      res.status(201).json({ message: 'Respuesta guardada exitosamente.', data: userResponse });
    } catch (error) {
      console.error('Error al guardar la respuesta del usuario:', error);
      res.status(500).json({ error: 'Error interno del servidor.' });
    }
  };

const getAllUserResponses = async (req, res) => {
    try {
      const responses = await UserResponse.findAll();
      res.status(200).json(responses);
    } catch (error) {
      console.error('Error al obtener las respuestas de usuarios:', error);
      res.status(500).json({ error: 'Error interno del servidor.' });
    }
  };

  const getUserResponsesByUserId = async (req, res) => {
    const { user_id } = req.params; // O puedes usar req.query si viene desde la URL
    
    try {
      const responses = await UserResponse.findAll({
        where: { user_id: user_id }  // Filtrar por user_id
      });
  
      if (responses.length === 0) {
        return res.status(404).json({ message: 'No se encontraron respuestas para este usuario.' });
      }
  
      res.status(200).json(responses);
    } catch (error) {
      console.error('Error al obtener las respuestas de usuario:', error);
      res.status(500).json({ error: 'Error interno del servidor.' });
    }
  };
module.exports = {
  saveUserResponse,
  getAllUserResponses,
  getUserResponsesByUserId
};
