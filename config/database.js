const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('chat_app', 'root', 'Dryan250303', {
  host: 'localhost',
  dialect: 'mysql',
});

module.exports = sequelize;

// =============================================================

// const { Sequelize } = require('sequelize');
// require('dotenv').config();  // Asegúrate de cargar las variables de entorno

// const sequelize = new Sequelize(
//   process.env.MYSQL_DATABASE,    // Nombre de la base de datos
//   process.env.MYSQL_USER,        // Usuario de la base de datos
//   process.env.MYSQL_PASSWORD,    // Contraseña de la base de datos
//   {
//     host: process.env.MYSQL_HOST, // Host de la base de datos
//     dialect: 'mysql',            // Dialecto de la base de datos
//     port: process.env.MYSQL_PORT  // Puerto de la base de datos
//   }
// );

// module.exports = sequelize;

// -------------------------------------------------------------

// const { Sequelize } = require('sequelize');
// require('dotenv').config();  // Asegúrate de cargar las variables de entorno

// const sequelize = new Sequelize(
//   'chat_app',    // Nombre de la base de datos
//   'admin',        // Usuario de la base de datos
//   'Dryan250303',    // Contraseña de la base de datos
//   {
//     host: 'database-1.ctkki2usirrr.us-east-2.rds.amazonaws.com', // Host de la base de datos
//     dialect: 'mysql',            // Dialecto de la base de datos
//     port: '3306'  // Puerto de la base de datos
//   }
// );

// module.exports = sequelize;
