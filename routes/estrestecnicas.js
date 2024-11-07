const express = require('express');
const router = express.Router();
const estresTecnicasController = require('../controllers/estresTecnicasController');

// CRUD routes
router.get('/estrestecnicas', estresTecnicasController.getAll);
router.get('/estrestecnicas/:id', estresTecnicasController.getById);
router.post('/estrestecnicas', estresTecnicasController.create);
router.put('/estrestecnicas/:id', estresTecnicasController.update);
router.delete('/estrestecnicas/:id', estresTecnicasController.delete);

// Ruta para generar técnicas de estrés automáticamente
router.post('/generador-tecnicas/:userId', estresTecnicasController.generadorEstresTecnicas);

module.exports = router;
