const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

const authMiddleware = require('../middlewares/authMiddleware'); // 👈 nombre original

router.post('/tasks', authMiddleware, taskController.createTask);
router.put('/tasks/:id', authMiddleware, taskController.updateTask);
router.get('/tasks', authMiddleware, taskController.getAllTasks);
router.delete('/tasks/:id', authMiddleware, taskController.deleteTask);

module.exports = router;



