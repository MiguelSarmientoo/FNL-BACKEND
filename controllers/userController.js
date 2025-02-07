const { User, UserResponses } = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const path = require("path");
const fs = require("fs");

// Login de usuario y generación de token
async function login(req, res) {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login exitoso",
      token,
      userId: user.id,
      username: user.username,
      email: user.email,
      id_empresa: user.id_empresa,
      permisopoliticas: user.permisopoliticas,
      userresponsebool: user.userresponsebool,
      testestresbool: user.testestresbool,
    });
  } catch (error) {
    console.error("Error en el login:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

async function createUser(req, res) {
  const { username, password, email, id_empresa } = req.body;
  const file = req.file; // Ahora usamos req.file, ya que es un solo archivo

  try {
    // Validaciones básicas
    if (!username || !password || !email || !id_empresa) {
      return res
        .status(400)
        .json({ error: "Todos los campos son obligatorios" });
    }

    // Manejo de la imagen
    let profileImagePath = null;
    if (file) {
      const uploadDir = path.join(__dirname, "../imagenes");
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
      id_empresa,
      profileImage: profileImagePath,
      created_at: new Date(),
    });

    res
      .status(201)
      .json({ message: "Usuario creado correctamente.", data: user });
  } catch (error) {
    console.error("Error al crear el usuario:", error);
    res.status(500).json({ error: "Error interno del servidor." });
  }
}

// Obtener perfil de usuario
async function getUserProfile(req, res) {
  try {
    const userProfile = await UserResponses.findOne({
      where: { user_id: req.params.id },
      include: [
        {
          model: require("../models/user"),
          attributes: ["email", "profileImage", "id_empresa"],
        },
        {
          model: require("../models/hierarchicalLevel"),
          attributes: ["level"],
        },
      ],
    });

    if (!userProfile) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const response = {
      email: userProfile.User.email,
      hierarchicalLevel: userProfile.HierarchicalLevel.level,
      gender_id: userProfile.gender_id,
      profileImage: userProfile.User.profileImage,
      id_empresa: userProfile.User.id_empresa,
    };

    return res.json(response);
  } catch (error) {
    console.error("Error al obtener el perfil de usuario:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}

async function updateProfile(req, res) {
  const { id } = req.params;
  const { username, email } = req.body;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    if (username) user.username = username;
    if (email) user.email = email;

    // Verifica si hay una nueva imagen
    if (req.file) {
      const uploadDir = path.join(__dirname, "../imagenes");
      const newProfileImagePath = `/imagenes/${req.file.filename}`; // Usar el nombre del archivo generado por multer
      user.profileImage = newProfileImagePath; // Actualiza la ruta de la imagen en el modelo
    }

    await user.save();
    res
      .status(200)
      .json({ message: "Perfil actualizado correctamente.", data: user });
  } catch (error) {
    console.error("Error al actualizar el perfil:", error);
    res.status(500).json({ error: "Error interno del servidor." });
  }
}

// Obtener todos los usuarios
async function getAllUsers(req, res) {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error al obtener los usuarios:", error);
    res.status(500).json({ error: "Error al obtener los usuarios" });
  }
}

// Actualizar un usuario
async function updateUser(req, res) {
  const { id } = req.params;
  const {
    username,
    email,
    password,
    permisopoliticas,
    funcyinteract,
    userresponsebool,
    testestresbool,
  } = req.body;

  try {
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    if (username) user.username = username;
    if (email) user.email = email;
    if (password) user.password = await bcrypt.hash(password, 10); // Encriptar la nueva contraseña
    if (permisopoliticas !== undefined)
      user.permisopoliticas = permisopoliticas;
    if (funcyinteract !== undefined) user.funcyinteract = funcyinteract;

    if (userresponsebool !== undefined) {
      // Convertir booleano a TINYINT(1) (1 o 0)
      user.userresponsebool =
        userresponsebool === true || userresponsebool === "true" ? 1 : 0;
    }

    if (testestresbool !== undefined) {
      user.testestresbool =
        testestresbool === true || testestresbool === "true" ? 1 : 0;
    }

    await user.save();

    res
      .status(200)
      .json({ message: "Usuario actualizado correctamente", data: user });
  } catch (error) {
    console.error("Error al actualizar el usuario:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

// Obtener un usuario por ID
async function getUserById(req, res) {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error al obtener el usuario:", error);
    res.status(500).json({ error: "Error interno del servidor" });
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
};
