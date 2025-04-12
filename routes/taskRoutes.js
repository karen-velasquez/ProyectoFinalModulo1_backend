const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

// Middleware de autenticación simulado (reemplaza por uno real si lo tienes)
const auth = (req, res, next) => {
  req.user = { id: 1 }; // simula usuario logueado
  next();
};

router.post('/tasks', auth, taskController.createTask);
router.put('/tasks/:id', auth, taskController.updateTask);
router.get('/tasks', taskController.getAllTasks);
router.delete('/tasks/:id', auth, taskController.deleteTask);


module.exports = router;

