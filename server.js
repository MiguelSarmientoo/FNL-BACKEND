const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); 
const messagesRouter = require('./routes/messages');
const usersRouter = require('./routes/user');
const openaiRouter = require('./routes/openai');
const activityRouter = require('./routes/activity'); // Importa el nuevo router de actividades
const sequelize = require('./config/database'); // Importa la configuración de Sequelize
const maintanceRouter = require('./routes/maintance');
const userResponseRoutes = require('./routes/userResponseRoutes');
const testEstresRoutes = require('./routes/TestEstresRoutes');
const estresNiveles = require('./routes/estresniveles');
const userEstresSession = require('./routes/userestressesion');
const userPrograma = require('./routes/userprograma');
const estresTecnicas = require('./routes/estrestecnicas');
const tipoTecnicas = require('./routes/tipotecnicas');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de CORS para permitir todos los orígenes sin credenciales
const corsOptions = {
  origin: '*', // Permite todos los orígenes
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions)); // Usa las opciones de CORS
app.use(bodyParser.json());
app.use('/api', messagesRouter);
app.use('/api', usersRouter);
app.use('/api', openaiRouter);
app.use('/api', activityRouter);
app.use('/api/v1/maintance', maintanceRouter);
// Usa las rutas para user_responses
app.use('/api', userResponseRoutes);
app.use('/api', testEstresRoutes);
app.use('/api', estresNiveles);
app.use('/api', userEstresSession);
app.use('/api', userPrograma);
app.use('/api', estresTecnicas);
app.use('/api', tipoTecnicas);


// Sincroniza los modelos con la base de datos
sequelize.sync({ force: false })  // Cambia force a true si quieres recrear las tablas en cada inicio
  .then(() => {
    console.log('Base de datos sincronizada');
  })
  .catch((err) => {
    console.error('Error al sincronizar la base de datos:', err);
  });

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
