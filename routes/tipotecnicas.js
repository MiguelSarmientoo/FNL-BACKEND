const express = require('express');
const router = express.Router();
const tipoTecnicasController = require('../controllers/tipoTecnicasController');

// CRUD routes
router.get('/tipotecnicas', tipoTecnicasController.getAll);
router.get('/tipotecnicas/:id', tipoTecnicasController.getById);
router.post('/tipotecnicas', tipoTecnicasController.create);
router.put('/tipotecnicas/:id', tipoTecnicasController.update);
router.delete('/tipotecnicas/:id', tipoTecnicasController.delete);

module.exports = router;
