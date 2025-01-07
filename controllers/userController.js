const { User, UserResponses, UserEstresSession } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');
const sequelize = require('../config/database');

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

    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Login exitoso',
      token,
      userId: user.id,
      username: user.username,
      email: user.email,
      permisopoliticas: user.permisopoliticas,
      userresponsebool: user.userresponsebool,
      testestresbool: user.testestresbool,
      id_empresa: user.id_empresa,
    });
  } catch (error) {
    console.error('Error en el login:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

async function createUser(req, res) {
  const { username, password, email } = req.body;
  const file = req.file; // Ahora usamos req.file, ya que es un solo archivo

  try {
    // Validaciones básicas
    if (!username || !password || !email) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    // Manejo de la imagen
    let profileImagePath = null;
    if (file) {
      const uploadDir = path.join(__dirname, '../imagenes');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      const fileName = `${Date.now()}-${file.filename}`;
      profileImagePath = `/imagenes/${file.filename}`;
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario
    const user = await User.create({
      username,
      password: hashedPassword,
      email,
      profileImage: profileImagePath,
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
      ],
    });

    if (!userProfile) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const response = {
      email: userProfile.User.email,
      hierarchicalLevel: userProfile.HierarchicalLevel.level,
      gender_id: userProfile.gender_id,
      profileImage: userProfile.User.profileImage,
    };

    return res.json(response);
  } catch (error) {
    console.error('Error al obtener el perfil de usuario:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}

async function updateProfile(req, res) {
  const { id } = req.params;
  const { username, email } = req.body;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    if (username) user.username = username;
    if (email) user.email = email;

    // Verifica si hay una nueva imagen
    if (req.file) {
      const uploadDir = path.join(__dirname, '../imagenes');
      const newProfileImagePath = `/imagenes/${req.file.filename}`; // Usar el nombre del archivo generado por multer
      user.profileImage = newProfileImagePath; // Actualiza la ruta de la imagen en el modelo
    }

    await user.save();
    res.status(200).json({ message: 'Perfil actualizado correctamente.', data: user });
  } catch (error) {
    console.error('Error al actualizar el perfil:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
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
//listar usuarios para el dashborad
async function listUsers(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    console.log(req.user)
    const { id_empresa, decoded} = req.user; // Obtenemos el id_empresa del usuario autenticado
    const { userId } = decoded;
    // Primero, obtenemos el conteo total de usuarios de la misma empresa
    const countQuery = `
      SELECT COUNT(*) as total 
      FROM users 
      WHERE id_empresa = :id_empresa
    `;
    const [{ total }] = await sequelize.query(countQuery, {
      replacements: { id_empresa },
      type: sequelize.QueryTypes.SELECT
    });

    // Consulta para obtener los usuarios con el mismo id_empresa
    const query = `
      SELECT u.id, u.username, u.email, u.profileImage, 
             ues.estres_nivel_id, hl.level
      FROM users u
      LEFT JOIN user_estres_sessions ues ON u.id = ues.user_id
      JOIN user_responses ur ON u.id = ur.user_id
      JOIN hierarchical_level hl ON ur.hierarchical_level_id = hl.id
      WHERE u.id_empresa = :id_empresa AND u.id != :userId
      LIMIT :limit OFFSET :offset
    `;
    
    const users = await sequelize.query(query, {
      replacements: { id_empresa,userId, limit, offset,  },
      type: sequelize.QueryTypes.SELECT
    });
    
    return res.status(200).json({
      users,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    return res.status(500).json({ 
      message: 'Error al obtener los usuarios',
      error: error.message 
    });
  }
}

//mostrar inforamcion de un solo usuario dashboard
async function getUserDashboard(req, res) {
  const { id } = req.params;

  try {
    const [results] = await sequelize.query(
      `
      SELECT 
        u.username, 
        u.email, 
        u.profileImage, 
        u.created_at, 
        s.estres_nivel_id
      FROM users u
      LEFT JOIN user_estres_sessions s ON u.id = s.user_id
      WHERE u.id = :id
      `,
      {
        replacements: { id },
        type: sequelize.QueryTypes.SELECT,
      }
    );
    if (!results) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.status(200).json(results);
  } catch (error) {
    console.error('Error al obtener el usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

// Actualizar un usuario
async function updateUser(req, res) {
  const { id } = req.params;
  const { username, email, password, permisopoliticas, funcyinteract, userresponsebool, testestresbool } = req.body;

  try {
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    if (username) user.username = username;
    if (email) user.email = email;
    if (password) user.password = await bcrypt.hash(password, 10); // Encriptar la nueva contraseña
    if (permisopoliticas !== undefined) user.permisopoliticas = permisopoliticas;
    if (funcyinteract !== undefined) user.funcyinteract = funcyinteract;

    if (userresponsebool !== undefined) {
      // Convertir booleano a TINYINT(1) (1 o 0)
      user.userresponsebool = userresponsebool === true || userresponsebool === 'true' ? 1 : 0;
    }

    if (testestresbool !== undefined) {
      user.testestresbool = testestresbool === true || testestresbool === 'true' ? 1 : 0;
    }

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

//listar cantidad de empleado por empresa
async function countUsersByCompany(req, res) {
  try {
    // Obtenemos el id_empresa del usuario logueado que viene en el req.user
    const { id_empresa } = req.user;

    const query = `
      SELECT 
        e.id,
        e.nombre as empresa_nombre,
        e.ruc,
        COUNT(u.id) - 1 as total_empleados
      FROM empresas e
      LEFT JOIN users u ON e.id = u.id_empresa
      WHERE e.id = :id_empresa
      GROUP BY e.id, e.nombre, e.ruc
    `;


    const result = await sequelize.query(query, {
      replacements: { id_empresa },
      type: sequelize.QueryTypes.SELECT
    });
    
    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Empresa no encontrada'
      });
    }

    return res.status(200).json({
      success: true,
      data: result[0]
    });
  } catch (error) {
    return res.status(500).json({ 
      success: false,
      message: 'Error al obtener el conteo de empleados de la empresa',
      error: error.message 
    });
  }
}

//contar las interacciones que se tuvo con funcy por empresa
async function interFuncy(req, res) {
  try {
    const { id_empresa } = req.user;

    const query = `
      SELECT 
        e.id,
        SUM(u.funcyinteract) as total_interacciones
      FROM empresas e
      LEFT JOIN users u ON e.id = u.id_empresa
      WHERE e.id = :id_empresa
      GROUP BY e.id
    `;

    const result = await sequelize.query(query, {
      replacements: { id_empresa },
      type: sequelize.QueryTypes.SELECT
    });
    
    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Empresa no encontrada'
      });
    }

    return res.status(200).json({
      success: true,
      data: result[0]
    });
  } catch (error) {
    return res.status(500).json({ 
      success: false,
      message: 'Error al obtener el conteo de interacciones con Funcy',
      error: error.message 
    });
  }
}
//cantidad de usuarios que interactuaron con funcy de la empresa
async function cantUserFuncy(req, res) {
  try {
    const { id_empresa } = req.user;

    const query = `
      SELECT 
        e.id,
        COUNT(u.funcyinteract) as total_usuarios_funcy
      FROM empresas e
      LEFT JOIN users u ON e.id = u.id_empresa
      WHERE e.id = :id_empresa AND u.funcyinteract != 0
      GROUP BY e.id
    `;

    const result = await sequelize.query(query, {
      replacements: { id_empresa },
      type: sequelize.QueryTypes.SELECT
    });
    
    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Empresa no encontrada'
      });
    }

    return res.status(200).json({
      success: true,
      data: result[0]
    });
  } catch (error) {
    return res.status(500).json({ 
      success: false,
      message: 'Error al obtener el conteo de interacciones con Funcy',
      error: error.message 
    });
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
  listUsers,
  getUserDashboard,
  countUsersByCompany,
  interFuncy,
  cantUserFuncy,
};
