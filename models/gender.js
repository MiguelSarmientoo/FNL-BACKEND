const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Gender = sequelize.define('Gender', {
  gender: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: false,
  tableName: 'gender', // Asegúrate de que este nombre coincida con el de la tabla en tu base de datos
});

module.exports = Gender;
