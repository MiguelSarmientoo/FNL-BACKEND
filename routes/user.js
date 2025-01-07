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
router.get('/users/list', userController.listUsers);
router.get('/users/:id', userController.getUserDashboard);
router.get('/empresa/cantidad',verifyToken, userController.countUsersByCompany);

module.exports = router;
