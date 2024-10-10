const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');  // Asegúrate de que el archivo database.js esté bien configurado

const EstresTecnicas = sequelize.define('EstresTecnicas', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true, // Clave primaria autoincremental
  },
  nombre: {
    type: DataTypes.STRING(255),
    allowNull: false,  // El nombre no puede ser nulo
  },
  mensaje: {
    type: DataTypes.TEXT,  // Campo de texto para el mensaje
    allowNull: true,  // Puede ser nulo si no hay mensaje
  },
  steps: {
    type: DataTypes.TEXT,  // Campo de texto para almacenar los pasos
    allowNull: true,  // Los pasos pueden ser nulos
  },
  tipo: {
    type: DataTypes.STRING(45),  // Máximo 45 caracteres para el campo "tipo"
    allowNull: true,  // Puede ser nulo si no hay tipo definido
  },
  icon: {
    type: DataTypes.STRING(255),
    allowNull: true,  // El nombre no puede ser nulo
  },
  tipotecnicas_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'tipotecnicas',  // Nombre de la tabla referenciada
      key: 'id'  // Clave primaria de la tabla tipotecnicas
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'  // Borra la técnica si se elimina el tipo de técnica
  }
}, {
  timestamps: false,  // Si no necesitas `createdAt` y `updatedAt`
  tableName: 'estrestecnicas',  // Nombre de la tabla en la base de datos
});

module.exports = EstresTecnicas;
