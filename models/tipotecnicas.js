//models/tipotecnicas.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');  // Asegúrate de que el archivo database.js esté bien configurado

const TipoTecnicas = sequelize.define('TipoTecnicas', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,  // Clave primaria autoincremental
  },
  nombre: {
    type: DataTypes.STRING(255),
    allowNull: false,  // El nombre no puede ser nulo
  }
}, {
  timestamps: false,  // Si no necesitas `createdAt` y `updatedAt`
  tableName: 'tipotecnicas',  // Nombre de la tabla en la base de datos
});

module.exports = TipoTecnicas;
