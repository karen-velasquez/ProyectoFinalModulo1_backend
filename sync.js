const db = require('./models');

db.sequelize.sync({ force: true }) // o { alter: true }
  .then(() => {
    console.log('Tablas creadas exitosamente');
    process.exit();
  })
  .catch(err => {
    console.error('Error al crear las tablas:', err);
  });
