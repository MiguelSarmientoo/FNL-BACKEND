const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const upload = require('../utils/uploadMiddleware'); // Importar el middleware
const { verifyToken } = require('../utils/authMiddleware');


// Rutas de usuario
router.post('/login', userController.login);
router.post('/register', userController.createUser);

// Rutas sin middleware de token
router.get('/users', userController.getAllUsers);
router.put('/users/:id', userController.updateUser);
router.get('/datos/users/:id', userController.getUserById);
router.get('/perfilUsuario/:id', userController.getUserProfile);
router.post('/actualizarPerfil/:id', upload, userController.updateProfile);


//dashboard
router.get('/users/list', verifyToken,userController.listUsers);
router.get('/users/:id', userController.getUserDashboard);
router.get('/empresa/cantidad',verifyToken, userController.countUsersByCompany);
router.get('/empresa/interaccion',verifyToken, userController.interFuncy);
router.get('/users/interaccion/cantidad',verifyToken, userController.cantUserFuncy);
module.exports = router;
