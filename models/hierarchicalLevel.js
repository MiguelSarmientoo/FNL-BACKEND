const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const HierarchicalLevel = sequelize.define('HierarchicalLevel', {
  level: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: false,
  tableName: 'hierarchical_level',
});

module.exports = HierarchicalLevel;
