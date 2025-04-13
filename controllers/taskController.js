const { Task, AuditLog, User } = require('../models');
const { Op } = require('sequelize');


// Crear tarea
exports.createTask = async (req, res) => {
  try {
    const { title, description, status, dueDate } = req.body;
    const userId = req.user.id; // suponiendo que tienes auth y el user está en req.user

    const task = await Task.create({
      title,
      description,
      status,
      dueDate,
      createdBy: userId,
    });

    // Auditoría
    await AuditLog.create({
      action: 'crear',
      userId,
      taskId: task.id,
    });

    res.status(201).json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear la tarea' });
  }
};


exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, dueDate } = req.body;
    const userId = req.user.id;

    const task = await Task.findByPk(id);
    if (!task) return res.status(404).json({ error: 'Tarea no encontrada' });

    // Regla 3: no permitir editar si está completada
    if (task.status === 'completada') {
      return res.status(400).json({ error: 'No se puede editar una tarea completada' });
    }

    // Regla 1: solo permitir cambiar a "en progreso" si está en "pendiente"
    if (status === 'en progreso' && task.status !== 'pendiente') {
      return res.status(400).json({ error: 'Solo se puede marcar como "en progreso" si está en "pendiente"' });
    }

    // Regla 2: no permitir volver a "pendiente"
    if (status === 'pendiente' && task.status !== 'pendiente') {
      return res.status(400).json({ error: 'No se puede volver al estado "pendiente"' });
    }

    await task.update({ title, description, status, dueDate });

    // Auditoría
    await AuditLog.create({
      action: 'editar',
      userId,
      taskId: task.id,
    });

    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar la tarea' });
  }
};



exports.getAllTasks = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status, search, dueDate } = req.query;

    const filters = { createdBy: userId };

    if (status) filters.status = status;

    if (search) {
      filters.title = { [Op.iLike]: `%${search}%` };
    }

    if (dueDate) {
      const date = new Date(dueDate); // esto toma la fecha local y la interpreta como UTC
      const startOfDay = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0));
      const endOfDay = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 23, 59, 59, 999));
    
      filters.dueDate = {
        [Op.between]: [startOfDay, endOfDay],
      };
    }
    
    

    const tasks = await Task.findAll({
      where: filters,
      include: {
        model: User,
        as: 'creator',
        attributes: ['id', 'name', 'email'],
      },
      order: [['createdAt', 'DESC']],
    });

    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener las tareas' });
  }
};




exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const task = await Task.findByPk(id);
    if (!task) return res.status(404).json({ error: 'Tarea no encontrada' });

    // Validar que la tarea esté en estado "completada"
    if (task.status !== 'completada') {
      return res.status(400).json({
        error: 'Solo se puede eliminar una tarea que esté en estado "completada".'
      });
    }

    await task.destroy();

    // Auditoría
    await AuditLog.create({
      action: 'eliminar',
      userId,
      taskId: id
    });

    res.json({ message: 'Tarea eliminada exitosamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar la tarea' });
  }
};
