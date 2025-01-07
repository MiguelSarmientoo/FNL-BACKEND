const jwt = require('jsonwebtoken');

// Middleware para verificar el token JWT
/*const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ message: 'No token provided, authorization denied' });
  }

  // Verificar el token
  jwt.verify(token.split(' ')[1], process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token is not valid' });
    }

    // Guardar el id del usuario en la request para su uso posterior
    req.user = decoded; // decoded contiene los datos del usuario (por ejemplo, el userId)
    next();
  });
};*/
//asincrono
const verifyToken = async (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ message: 'No token provided, authorization denied' });
  }

  try {
    // Verifica el token y decodifica los datos
    const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);

    // Recupera información adicional del usuario si es necesario
    const user = await User.findByPk(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Agrega datos adicionales a req.user
    req.user = {
      decoded,
      id_empresa: user.id_empresa, // Información adicional del usuario
    };

    next();
  } catch (err) {
    console.error('Error verificando el token:', err);
    return res.status(401).json({ message: 'Token is not valid' });
  }
};
module.exports = {
  verifyToken
};
