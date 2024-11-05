const express = require('express');
const router = express.Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const userController = require('../controllers/userController');
// const { verifyToken } = require('../middleware/authMiddleware');
const { verifyToken } = require('../utils/authMiddleware'); // Importamos el middleware de autenticación

router.post('/login', userController.login); 
router.post('/crearUsuario', upload.single('profileImage'), userController.createUser);
router.get('/users', verifyToken, userController.getAllUsers); 
router.put('/users/:id', verifyToken, userController.updateUser);  // Agrega la ruta para actualizar un usuario
router.get('/datos/users/:id', verifyToken, userController.getUserById);  // Agrega la ruta para actualizar un usuario
router.get('/perfilUsuario/:id',userController.getUserProfile);
router.post('/actualizarPerfil/:id', upload.single('profileImage'),userController.updateProfile);

module.exports = router;