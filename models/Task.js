// models/Task.js
module.exports = (sequelize, DataTypes) => {
    const Task = sequelize.define('Task', {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: DataTypes.TEXT,
      status: {
        type: DataTypes.ENUM('pendiente', 'en progreso', 'completada'),
        defaultValue: 'pendiente',
      },
      dueDate: DataTypes.DATE,
    });
  
    Task.associate = models => {
      Task.belongsTo(models.User, { as: 'creator', foreignKey: 'createdBy' });
      Task.hasMany(models.AuditLog, { foreignKey: 'taskId' });
    };
  
    return Task;
  };
  