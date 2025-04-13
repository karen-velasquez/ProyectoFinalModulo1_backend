// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const authMiddleware = async (req, res, next) => {

    console.log('JWT_SECRET:', process.env.JWT_SECRET);

  const authHeader = req.headers.authorization;

  // Validar que el token venga en el header
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verifica el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Busca al usuario y lo adjunta a req.user
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'Usuario no válido' });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: 'Token inválido' });
  }
};

module.exports = authMiddleware;
