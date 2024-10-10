const { Sequelize } = require('sequelize');

// Configuración de la base de datos
const sequelize = new Sequelize('chat_app', 'admin', 'rootfnl2024', {
  host: 'databasefnl-instance-1.ctkki2usirrr.us-east-2.rds.amazonaws.com', // Punto de enlace de RDS
  dialect: 'mysql',
  port: 3306, // Puerto de la base de datos
});

// Función para probar la conexión
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida correctamente.');
  } catch (error) {
    console.error('No se pudo conectar a la base de datos:', error);
  }
};

// Llamar a la función para probar la conexión
testConnection();

module.exports = sequelize;
