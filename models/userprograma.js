//models/userprograma.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const EstresTecnicas = require('./estrestecnicas');  // Asegúrate de importar el modelo relacionado

const UserPrograma = sequelize.define('UserPrograma', {
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
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  estrestecnicas_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'estrestecnicas',  // Nombre de la tabla 'estrestecnicas'
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  dia: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  comentario: {
    type: DataTypes.TEXT,  // Campo largo de texto para comentarios
    allowNull: true,
  },
  estrellas: {
    type: DataTypes.INTEGER,  // Campo para las estrellas (rating)
    allowNull: false,
    validate: {
      min: 0,  // Puedes agregar validaciones, por ejemplo, estrellas entre 0 y 5
      max: 5,
    },
  },
  start_date: {
    type: DataTypes.DATE,  // Fecha de inicio del programa
    allowNull: false,
  }
}, {
  timestamps: false,
  tableName: 'userprograma',
});

// Relación con el modelo EstresTecnicas
UserPrograma.belongsTo(EstresTecnicas, {
  foreignKey: 'estrestecnicas_id',
  as: 'tecnica'  // Alias para la relación
});

module.exports = UserPrograma;
