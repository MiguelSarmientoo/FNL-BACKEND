const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Role = require('../models/roles'); 

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  id_empresa: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'empresas',
      key: 'id',
    },
  },
  role_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'roles',
      key: 'id',
    },
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  permisopoliticas: { 
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  funcyinteract: { 
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
  },
  profileImage: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  userresponsebool: { 
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  testestresbool: { 
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
}, {
  timestamps: false,
  tableName: 'users',
});

User.belongsTo(Role, { foreignKey: 'role_id', as: 'role' });
Role.hasMany(User, { foreignKey: 'role_id' });

module.exports = User;
