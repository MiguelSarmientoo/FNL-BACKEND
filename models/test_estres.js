const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TestEstres = sequelize.define('TestEstres', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true, // Clave primaria autoincremental
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',  // Referencia a la tabla users
      key: 'id',
    },
  },
  pregunta_1: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  pregunta_2: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  pregunta_3: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  pregunta_4: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  pregunta_5: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  pregunta_6: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  pregunta_7: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  pregunta_8: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  pregunta_9: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  pregunta_10: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  pregunta_11: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  pregunta_12: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  pregunta_13: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  pregunta_14: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  pregunta_15: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  pregunta_16: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  pregunta_17: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  pregunta_18: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  pregunta_19: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  pregunta_20: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  pregunta_21: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  pregunta_22: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  pregunta_23: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  estado: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
}, {
  timestamps: false,  
  tableName: 'test_estres', 
});

module.exports = TestEstres;
