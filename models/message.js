const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user'); // Asegúrate de importar el modelo User

const Message = sequelize.define('Message', {
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User, // Aquí se refiere al modelo User
      key: 'id',
    }
  },
  user_id_receptor: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User, // Aquí se refiere al modelo User
      key: 'id',
    }
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  timestamps: false,
  tableName: 'messages', // Nombre explícito de la tabla en la base de datos
});

module.exports = Message;
