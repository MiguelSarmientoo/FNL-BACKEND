const express = require('express');
const empresaController = require('../controllers/empresaController');

const router = express.Router();

router.post('/empresa/register', empresaController.createEmpresa);

module.exports = router;