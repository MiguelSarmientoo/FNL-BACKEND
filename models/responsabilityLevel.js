const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ResponsabilityLevel = sequelize.define('ResponsabilityLevel', {
  level: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: false,
  tableName: 'responsability_level', 
});

module.exports = ResponsabilityLevel;
