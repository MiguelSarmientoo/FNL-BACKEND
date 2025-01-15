const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); 
const path = require('path');
const messagesRouter = require('./routes/messages');
const usersRouter = require('./routes/user');
const openaiRouter = require('./routes/openai');
const activityRouter = require('./routes/activity'); 
const sequelize = require('./config/database');
const maintanceRouter = require('./routes/maintance');
const userResponseRoutes = require('./routes/userResponseRoutes');
const empresaRoutes = require('./routes/empresa');
const testEstresRoutes = require('./routes/TestEstresRoutes');
const estresNiveles = require('./routes/estresniveles');
const userEstresSession = require('./routes/userestressesion');
const userPrograma = require('./routes/userprograma');
const estresTecnicas = require('./routes/estrestecnicas');
const tipoTecnicas = require('./routes/tipotecnicas');
const testEstresSalidaRoutes = require('./routes/test_estres_salida'); 
const empresaRouter = require('./routes/empresa');
const { UserEstresSession, User, HierarchicalLevel } = require('./models');
const UserResponse = require('./models/user_responses');
const Empresa = require('./models/empresa');
const app = express();
const PORT = process.env.PORT || 3000;

const corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

// Configuración de rutas
app.use('/api', messagesRouter);
app.use('/api', usersRouter);
app.use('/api', empresaRoutes);
app.use('/api', openaiRouter);
app.use('/api', activityRouter);
app.use('/api/v1/maintance', maintanceRouter);
app.use('/api', userResponseRoutes);
app.use('/api', testEstresRoutes);
app.use('/api', estresNiveles);
app.use('/api', userEstresSession);
app.use('/api', userPrograma);
app.use('/api', estresTecnicas);
app.use('/api', tipoTecnicas);
app.use('/api', testEstresSalidaRoutes);
app.use('/api',empresaRouter);

// Configuración de ruta estática para archivos de imagen
app.use('/imagenes', express.static(path.join(__dirname, 'imagenes')));
User.hasMany(UserEstresSession, { foreignKey: 'user_id' });
UserEstresSession.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(UserResponse, { foreignKey: 'user_id' });
UserResponse.belongsTo(User, { foreignKey: 'user_id' });

UserResponse.belongsTo(HierarchicalLevel, { foreignKey: 'hierarchical_level_id' });
HierarchicalLevel.hasMany(UserResponse, { foreignKey: 'hierarchical_level_id' });

Empresa.hasMany(User, { foreignKey: 'id_empresa' });
User.belongsTo(Empresa, { foreignKey: 'id_empresa' });
// Sincroniza los modelos con la base de datos
sequelize.sync({ force: false })
  .then(() => {
    console.log('Base de datos sincronizada');
  })
  .catch((err) => {
    console.error('Error al sincronizar la base de datos:', err);
  });

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
