const express = require('express');
const router = express.Router();
const userResponseController = require('../controllers/userResponseController');

// Definir las rutas para user_responses
router.post('/guardarUserResponses', userResponseController.saveUserResponse); // Ruta para guardar respuestas de usuarios
router.get('/userResponses', userResponseController.getAllUserResponses); // Ruta para obtener todas las respuestas de usuarios
router.get('/userResponses/:user_id', userResponseController.getUserResponsesByUserId); 

module.exports = router;
