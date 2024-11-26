const express = require('express');
const router = express.Router();
const userEstresSessionController = require('../controllers/userEstresSessionController');

router.get('/userestresessions/:user_id/nivel', userEstresSessionController.getEstresNivelByUserId);
router.post('/userestresessions/assign', userEstresSessionController.assignEstresNivel);

// Ruta para obtener la distribución global de niveles de estrés
router.get('/userestresessions/global-distribution', userEstresSessionController.getGlobalStressDistribution);

module.exports = router;
