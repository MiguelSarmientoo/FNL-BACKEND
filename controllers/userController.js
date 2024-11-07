// controllers/userController.js
const { User } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const { UserResponses } = require('../models');

// Configuración de multer para el almacenamiento de imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'imagenes/'); // Asegúrate de que esta carpeta exista
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  },
});
const upload = multer({ storage });

// Login de usuario y generación de token
async function login(req, res) {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Generar el token JWT
    const token = jwt.sign({ userId: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
      message: 'Login exitoso',
      token: token,
      userId: user.id,
      username: user.username,
      email: user.email,
      permisopoliticas: user.permisopoliticas,
    });
  } catch (error) {
    console.error('Error en el login:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

// Crear usuario
async function createUser(req, res) {
  const { username, password, email } = req.body;
  const profileImage = req.file ? req.file.path : null;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      password: hashedPassword,
      email,
      profileImage, // Almacena la ruta de la imagen
      created_at: new Date(),
    });

    res.status(201).json({ message: 'Usuario creado correctamente.', data: user });
  } catch (error) {
    console.error('Error al crear el usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
}

// Obtener perfil de usuario
async function getUserProfile(req, res) {
  try {
    const userProfile = await UserResponses.findOne({
      where: { user_id: req.params.id },
      include: [
        { model: require('../models/user'), attributes: ['email', 'profileImage'] },
        { model: require('../models/hierarchicalLevel'), attributes: ['level'] },
      ]
    });

    if (!userProfile) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const response = {
      email: userProfile.User.email,
      hierarchicalLevel: userProfile.HierarchicalLevel.level,
      gender_id: userProfile.gender_id,
      profileImage: userProfile.User.profileImage,  // Debería ser la ruta de la imagen
    };

    return res.json(response);
  } catch (error) {
    console.error('Error al obtener el perfil de usuario:', error);
    return res.status(500).json({ error: 'Error al obtener el perfil de usuario' });
  }
}

// Actualizar perfil de usuario (incluyendo la imagen de perfil)
async function updateProfile(req, res) {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    if (req.file) {
      user.profileImage = req.file.path; // Guarda la ruta de la imagen
      await user.save();
      return res.json({ message: 'Imagen de perfil actualizada exitosamente.' });
    }

    res.status(400).json({ message: 'No se ha proporcionado ninguna imagen.' });
  } catch (error) {
    console.error('Error al actualizar el perfil de usuario:', error);
    return res.status(500).json({ message: 'Error al actualizar la imagen de perfil.' });
  }
}

// Obtener todos los usuarios
async function getAllUsers(req, res) {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    console.error('Error al obtener los usuarios:', error);
    res.status(500).json({ error: 'Error al obtener los usuarios' });
  }
}

// Actualizar un usuario
async function updateUser(req, res) {
  const { id } = req.params;
  const { username, email, password, permisopoliticas, funcyinteract } = req.body;

  try {
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    if (username) user.username = username;
    if (email) user.email = email;
    if (password) user.password = await bcrypt.hash(password, 10);  // Encriptar la nueva contraseña
    if (permisopoliticas !== undefined) user.permisopoliticas = permisopoliticas;
    if (funcyinteract !== undefined) user.funcyinteract = funcyinteract;

    await user.save();

    res.status(200).json({ message: 'Usuario actualizado correctamente', data: user });
  } catch (error) {
    console.error('Error al actualizar el usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

// Obtener un usuario por ID
async function getUserById(req, res) {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Error al obtener el usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

module.exports = {
  login,
  createUser,
  getAllUsers,
  updateUser,
  getUserById,
  getUserProfile,
  updateProfile,
  upload // Exportamos upload para que las rutas puedan acceder a él
};
