const express = require('express');
const router = express.Router();
const userEstresSessionController = require('../controllers/userEstresSessionController');

// Ruta para obtener el nivel de estrés de un usuario por su user_id
router.get('/userestresessions/:user_id/nivel', userEstresSessionController.getEstresNivelByUserId);
router.post('/userestresessions/assign', userEstresSessionController.assignEstresNivel);


module.exports = router;
