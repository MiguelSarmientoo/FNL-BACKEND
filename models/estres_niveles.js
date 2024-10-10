const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');  // Asegúrate de que el archivo database.js esté bien configurado

const EstresNiveles = sequelize.define('EstresNiveles', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true, // Clave primaria autoincremental
  },
  nombre: {
    type: DataTypes.STRING(50),
    allowNull: false,  // El nombre es obligatorio
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true,  // Puede ser nulo si no hay descripción
  }
}, {
  timestamps: false,  // Si no necesitas `createdAt` y `updatedAt`
  tableName: 'estres_niveles',  // Nombre de la tabla en la base de datos
});

module.exports = EstresNiveles;
