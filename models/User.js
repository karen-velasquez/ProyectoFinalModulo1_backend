// models/User.js
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: { isEmail: true },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    });
  
    User.associate = models => {
      User.hasMany(models.Task, { foreignKey: 'createdBy' });
      User.hasMany(models.AuditLog, { foreignKey: 'userId' });
    };
  
    return User;
  };
  