const { User } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

async function login(req, res) {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username } });
    
    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Verificar la contraseña con bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Generar el token JWT
    const token = jwt.sign({ userId: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Enviar el token junto con el id, username y email
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


async function createUser(req, res) {
  const { username, password, email } = req.body;

  try {
    // Encriptar la contraseña con bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      password: hashedPassword, // Guardar la contraseña encriptada
      email,
      created_at: new Date()
    });

    res.status(200).json({ message: 'Usuario creado correctamente.', data: user });
  } catch (error) {
    console.error('Error al crear el usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
}

async function getAllUsers(req, res) {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Error fetching users' });
  }
}

async function updateUser(req, res) {
  const { id } = req.params;  // Obtener el ID del usuario de los parámetros de la URL
  const { username, email, password, permisopoliticas, funcyinteract } = req.body;  // Datos que pueden ser actualizados

  try {
    // Buscar el usuario por ID
    const user = await User.findByPk(id);
    
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Actualizar los campos proporcionados en el cuerpo de la solicitud
    if (username) user.username = username;
    if (email) user.email = email;
    if (password) user.password = await bcrypt.hash(password, 10);  // Encriptar la nueva contraseña si se proporciona
    if (permisopoliticas !== undefined) user.permisopoliticas = permisopoliticas;
    if (funcyinteract !== undefined) user.funcyinteract = funcyinteract;

    // Guardar los cambios
    await user.save();

    res.status(200).json({ message: 'Usuario actualizado correctamente', data: user });
  } catch (error) {
    console.error('Error al actualizar el usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

async function getUserById(req, res) {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.status(200).json(user); // Aquí retornas el usuario completo, incluido el valor de funcyinteract
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
  getUserById
};
