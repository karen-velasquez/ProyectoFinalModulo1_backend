const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');


// Middleware de autenticación simulado (reemplaza por uno real si lo tienes)
const auth = (req, res, next) => {
    req.user = { id: 1 }; // simula usuario logueado
    next();
  };
  

router.post('/users/register', authController.register);
router.post('/users/login', authController.login);

module.exports = router;