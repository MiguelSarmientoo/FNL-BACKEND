const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const estresTecnicasController = require('../controllers/estresTecnicasController');
const upload = userController.upload; // Asegúrate de importar upload correctamente

// Rutas de usuario
router.post('/login', userController.login);
router.post('/crearUsuario', upload.single('profileImage'), userController.createUser);

// Rutas sin middleware de token
router.get('/users', userController.getAllUsers);
router.put('/users/:id', userController.updateUser);
router.get('/datos/users/:id', userController.getUserById);
router.get('/perfilUsuario/:id', userController.getUserProfile);
router.post('/actualizarPerfil/:id', upload.single('profileImage'), userController.updateProfile);

// Rutas para las técnicas de estrés
// Generar técnicas de estrés para un usuario específico (de acuerdo con el tipo de estrés)
router.post('/estres/usuario/:userId', estresTecnicasController.generadorEstresTecnicas);

// Obtener todas las técnicas de estrés
router.get('/estres/tecnicas', estresTecnicasController.getAll);

// Obtener una técnica de estrés por su ID
router.get('/estres/tecnica/:id', estresTecnicasController.getById);

// Crear una nueva técnica de estrés
router.post('/estres/tecnica', estresTecnicasController.create);

// Actualizar una técnica de estrés por ID
router.put('/estres/tecnica/:id', estresTecnicasController.update);

// Eliminar una técnica de estrés por ID
router.delete('/estres/tecnica/:id', estresTecnicasController.delete);

module.exports = router;
