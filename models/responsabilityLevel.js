const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ResponsabilityLevel = sequelize.define('ResponsabilityLevel', {
  level: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: false,
  tableName: 'responsability_level', // Asegúrate de que este nombre coincida con el de la tabla en tu base de datos
});

module.exports = ResponsabilityLevel;
