// models/AuditLog.js
module.exports = (sequelize, DataTypes) => {
    const AuditLog = sequelize.define('AuditLog', {
      action: {
        type: DataTypes.ENUM('crear', 'editar', 'eliminar'),
        allowNull: false,
      },
      timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    });
  
    AuditLog.associate = models => {
      AuditLog.belongsTo(models.User, { foreignKey: 'userId' });
      AuditLog.belongsTo(models.Task, { foreignKey: 'taskId' });
    };
  
    return AuditLog;
  };
  