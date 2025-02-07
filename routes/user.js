const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const upload = require('../utils/uploadMiddleware'); // Importar el middleware


// Rutas de usuario
router.post('/login', userController.login);
router.post('/register', userController.createUser);

// Rutas sin middleware de token
router.get('/users', userController.getAllUsers);
router.put('/users/:id', userController.updateUser);
router.get('/datos/users/:id', userController.getUserById);
router.get('/perfilUsuario/:id', userController.getUserProfile);
router.post('/actualizarPerfil/:id', upload, userController.updateProfile);

module.exports = router;
