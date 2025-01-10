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

const limitRequestOpenAi = 20;
const rateLimitOpenAi = rateLimit({
  windowMs: 24 * 60 * 60 *1000,
  max: limitRequestOpenAi,
  message: {
    status: 429,
    error: `Has superado el limite de ${limitRequestOpenAi} solicitudes por dia`
  },
  keyGenerator: (req) => {
    const token = req.headers['authorization'].split(' ')[1];
    if (!token) {
      throw new Error('No token provided, authorization denied');
    }
    const decoded = jwt.decode(token);
    return decoded.userId;
  },
  standardHeaders:true,
  legacyHeaders:true
})
module.exports = {
  verifyToken,
  rateLimitOpenAi
};
