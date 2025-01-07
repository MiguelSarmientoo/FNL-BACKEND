const express = require('express');
const router = express.Router();
const userProgramaController = require('../controllers/userProgramaController');
const { route } = require('./user');

// CRUD routes
router.get('/userprograma', userProgramaController.getAll);
// router.get('/userprograma/:id', userProgramaController.getById);
router.post('/userprograma', userProgramaController.create);
router.put('/userprograma/:id', userProgramaController.update);
router.delete('/userprograma/:id', userProgramaController.delete);


router.post('/userprograma/report/:user_id', userProgramaController.createAndGenerateReport);

router.post('/userprograma/getprogramcompleto/:user_id', userProgramaController.getByUserIdAndOrderByDia);
router.put('/userprograma/:user_id/:id', userProgramaController.updateByUserAndTecnica);

//dashboard
router.get('/userprograma/user/:user_id', userProgramaController.getByUserId);
router.get('/userprograma/completadas', userProgramaController.taskCompleted);
module.exports = router;

