//routes/TestEstresRoutes.js
const express = require('express');
const router = express.Router();
const testEstresController = require('../controllers/testEstresController');

router.post('/guardarTestEstres', testEstresController.saveTestEstres); 
router.get('/listarTestEstres', testEstresController.getAllTestEstres); 

module.exports = router;
