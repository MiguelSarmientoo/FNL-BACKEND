//models/user_responses.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user'); 
const HierarchicalLevel = require('./hierarchicalLevel');
const UserResponse = sequelize.define('UserResponse', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  age_range_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'age_range',
      key: 'id',
    },
  },
  hierarchical_level_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'hierarchical_level',
      key: 'id',
    },
  },
  responsability_level_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'responsability_level',
      key: 'id',
    },
  },
  gender_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'gender',
      key: 'id',
    },
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  timestamps: false,
  tableName: 'user_responses',
});

UserResponse.belongsTo(User, { foreignKey: 'user_id' });
UserResponse.belongsTo(HierarchicalLevel, { foreignKey: 'hierarchical_level_id' });

// Exportar el modelo
module.exports = UserResponse;
