const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');


const authMiddleware = require('../middlewares/authMiddleware');

// Obtener el perfil del usuario autenticado
router.get('/me', authMiddleware, userController.getProfile); // 👈 Aquí es donde agregas la ruta

router.post('/users/register', authController.register);
router.post('/users/login', authController.login);

module.exports = router;