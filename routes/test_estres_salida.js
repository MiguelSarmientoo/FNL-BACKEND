const express = require('express');
const router = express.Router();
const testEstresSalidaController = require('../controllers/testEstresSalidaController');

router.post('/guardarTestEstresSalida', testEstresSalidaController.saveTestEstresSalida); 
router.get('/listarTestEstresSalida', testEstresSalidaController.getAllTestEstresSalida); 

module.exports = router;
