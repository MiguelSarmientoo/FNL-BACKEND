const express = require('express');
const router = express.Router();
const estresTecnicasController = require('../controllers/estresTecnicasController');

// CRUD routes
router.get('/estrestecnicas', estresTecnicasController.getAll);
router.get('/estrestecnicas/:id', estresTecnicasController.getById);
router.post('/estrestecnicas', estresTecnicasController.create);
router.put('/estrestecnicas/:id', estresTecnicasController.update);
router.delete('/estrestecnicas/:id', estresTecnicasController.delete);

module.exports = router;