const { Sequelize } = require('sequelize');

<<<<<<< HEAD
// Configuración de la base de datos para localhost
const sequelize = new Sequelize('chat_app', 'root', '', {
  host: 'localhost', // Cambiado a localhost
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
