const express = require('express');
const router = express.Router();
const estresNivelesController = require('../controllers/estresNivelesController');

router.get('/estresniveles/:id/nombre', estresNivelesController.getNombreById);

module.exports = router;
