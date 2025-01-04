const sequelize = require('../config/database'); // Asegúrate de que sequelize esté importado
const User = require('./user');
const Message = require('./message');
const AgeRange = require('./ageRange');
const HierarchicalLevel = require('./hierarchicalLevel');
const ResponsabilityLevel = require('./responsabilityLevel');
const Gender = require('./gender');
const UserResponses = require('./user_responses');
const Empresa = require('./empresas');
const TestEstres = require('./test_estres');
const EstresTecnicas = require('./estrestecnicas');
const UserPrograma = require('./userprograma');
const TipoTecnicas = require('./tipotecnicas');
const UserEstresSession = require('./userestressession');


User.hasMany(Message, { foreignKey: 'user_id' });
User.hasMany(Message, { foreignKey: 'user_id_receptor' });
Message.belongsTo(User, { foreignKey: 'user_id', as: 'sender' });
Message.belongsTo(User, { foreignKey: 'user_id_receptor', as: 'receiver' });

// Sincronizar los modelos con la base de datos
sequelize.sync()
  .then(() => {
    console.log('Base de datos sincronizada');
  })
  .catch(error => {
    console.error('Error al sincronizar la base de datos:', error);
  });

module.exports = {
  User,
  Empresa,
  Message,
  AgeRange,
  HierarchicalLevel,
  ResponsabilityLevel,
  Gender,
  UserResponses,
  TestEstres,
  EstresTecnicas,
  UserPrograma,
  TipoTecnicas,
  UserEstresSession
};
