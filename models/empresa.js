//modelo empresa
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Empresa = sequelize.define('Empresa', {
    id : {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    ruc: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    fecha_creacion: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    }, {
    timestamps: false,
    tableName: 'empresas',
});
module.exports = Empresa;