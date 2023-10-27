const jwt = require('jsonwebtoken');

// Generar un nuevo token para el usuario
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, 'your-secret-key', {
    expiresIn: '1d',  // El token expira en 1 día
  });
};

// Verificar el token del usuario
const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, 'your-secret-key');
    return decoded.id;
  } catch (err) {
    return null;
  }
};

module.exports = { generateToken, verifyToken };
