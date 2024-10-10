const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AgeRange = sequelize.define('AgeRange', {
  age_range: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: false,
  tableName: 'age_range', // Asegúrate de que este sea el nombre correcto de la tabla
});

module.exports = AgeRange;
