const jwt = require('jsonwebtoken');

// Middleware para verificar el token JWT
const verifyToken = (req, res, next) => {
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
};

module.exports = {
  verifyToken
};
