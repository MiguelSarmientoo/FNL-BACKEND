const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');  // Asegúrate de que el archivo database.js esté bien configurado

const UserEstresSession = sequelize.define('UserEstresSession', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true, // Clave primaria autoincremental
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,  // Campo obligatorio
    references: {
      model: 'users',  // Referencia a la tabla de usuarios
      key: 'id',
    },
    onUpdate: 'CASCADE',  // Actualización en cascada
    onDelete: 'CASCADE',  // Eliminación en cascada
  },
  estres_nivel_id: {
    type: DataTypes.INTEGER,
    allowNull: false,  // Campo obligatorio
    references: {
      model: 'estres_niveles',  // Referencia a la tabla de niveles de estrés
      key: 'id',
    },
    onUpdate: 'CASCADE',  // Actualización en cascada
    onDelete: 'CASCADE',  // Eliminación en cascada
  }
}, {
  timestamps: false,  // Si no necesitas `createdAt` y `updatedAt`
  tableName: 'user_estres_sessions',  // Nombre de la tabla en la base de datos
});

module.exports = UserEstresSession;
