// //models/userprograma.js
// const { DataTypes } = require('sequelize');
// const sequelize = require('../config/database');
// const EstresTecnicas = require('./estrestecnicas');  // Asegúrate de importar el modelo relacionado

// const UserPrograma = sequelize.define('UserPrograma', {
//   id: {
//     type: DataTypes.INTEGER,
//     autoIncrement: true,
//     primaryKey: true,
//   },
//   user_id: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//     references: {
//       model: 'users',
//       key: 'id',
//     },
//     onUpdate: 'CASCADE',
//     onDelete: 'CASCADE',
//   },
//   estrestecnicas_id: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//     references: {
//       model: 'estrestecnicas',  // Nombre de la tabla 'estrestecnicas'
//       key: 'id',
//     },
//     onUpdate: 'CASCADE',
//     onDelete: 'CASCADE',
//   },
//   dia: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//   },
//   comentario: {
//     type: DataTypes.TEXT,  // Campo largo de texto para comentarios
//     allowNull: true,
//   },
//   estrellas: {
//     type: DataTypes.INTEGER,  // Campo para las estrellas (rating)
//     allowNull: false,
//     validate: {
//       min: 0,  // Puedes agregar validaciones, por ejemplo, estrellas entre 0 y 5
//       max: 5,
//     },
//   },
//   start_date: {
//     type: DataTypes.DATE,  // Fecha de inicio del programa
//     allowNull: false,
//   }
// }, {
//   timestamps: false,
//   tableName: 'userprograma',
// });

// // Relación con el modelo EstresTecnicas
// UserPrograma.belongsTo(EstresTecnicas, {
//   foreignKey: 'estrestecnicas_id',
//   as: 'tecnica'  // Alias para la relación
// });

// module.exports = UserPrograma;


const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const EstresTecnicas = require('./estrestecnicas');  // Asegúrate de importar el modelo relacionado si aún lo necesitas

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
      model: 'users',  // Relacionado con la tabla 'users'
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  dia: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  nombre_tecnica: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  tipo_tecnica: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  guia: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  comentario: {
    type: DataTypes.TEXT,  // Comentarios del usuario sobre la técnica
    allowNull: true,
  },
  estrellas: {
    type: DataTypes.INTEGER,  // Calificación con estrellas
    allowNull: true,  // Puedes ajustarlo si prefieres que sea obligatorio
    validate: {
      min: 1,  // Validación para asegurarse de que la calificación sea al menos 1
      max: 5,  // Validación para asegurarse de que la calificación no supere 5
    },
  },
  start_date: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null,  // Valor por defecto de la fecha de inicio es el momento actual
  },
  completed_date: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null,  // Valor por defecto de la fecha de inicio es el momento actual
  },
}, {
  timestamps: false,
  tableName: 'userprograma',
});

module.exports = UserPrograma;
