const express = require('express');
const router = express.Router();
const empresaController = require('../controllers/empresaController');

// Ruta para obtener todas las empresas
router.get('/empresa', empresaController.getEmpresas);

// Ruta para obtener una empresa por ID
router.get('/empresa/:id', empresaController.getEmpresaById);

// Ruta para crear una nueva empresa
router.post('/empresa', empresaController.createEmpresa);

// Ruta para actualizar una empresa por ID
router.put('/empresa/:id', empresaController.updateEmpresa);

// Ruta para eliminar una empresa por ID
router.delete('/empresa/:id', empresaController.deleteEmpresa);

module.exports = router;