const UserPrograma = require('../models/userprograma');
const EstresTecnicas = require('../models/estrestecnicas');
const UserEstresSession = require('../models/userestressession');
const UserResponse = require('../models/user_responses');
const User = require('../models/user');
const { getBotResponse } = require('./openaiController');
const moment = require('moment');
const { addDays } = require('date-fns');



// Mapeo para los valores de estrés, rango de edad, nivel jerárquico, nivel de responsabilidad y género
const estresNivelMap = {
  1: 'Leve',
  2: 'Moderado',
  3: 'Severo'
};

const ageRangeMap = {
  1: '18-25',
  2: '26-35',
  3: '36-45',
  4: '46-60'
};

const hierarchicalLevelMap = {
  1: 'Gerente',
  2: 'Supervisor',
  3: 'Coordinador',
  4: 'Analista',
  5: 'Otro'
};

const responsabilityLevelMap = {
  1: 'Alto',
  2: 'Medio',
  3: 'Bajo'
};

const genderMap = {
  1: 'Masculino',
  2: 'Femenino',
  3: 'Otro'
};

const tecnicaTipoMap = {
  1: 'Técnica de Relajación',
  2: 'Reestructuración Cognitiva',
  3: 'PNL'
};

// Mapeo para los valores de las respuestas
const respuestaMap = {
  1: "Nunca",
  2: "Raras veces",
  3: "Ocasionalmente",
  4: "Algunas veces",
  5: "Frecuentemente",
  6: "Generalmente",
  7: "Siempre"
};

// Definiciones de las preguntas
const preguntasDefiniciones = {
  pregunta_1: "Tener que hacer reportes tanto para sus jefes como para las personas de su equipo le preocupa, porque siente que debe cumplir con las expectativas de todos y eso le genera tensión.",
  pregunta_2: "Si no puede controlar lo que sucede en su área de trabajo, se frustra, ya que le gusta tener todo bajo control y organizado.",
  pregunta_3: "Si no cuenta con el equipo necesario para hacer su trabajo, se siente estresado porque no puede hacerlo de la mejor manera.",
  pregunta_4: "Cuando su jefe no lo apoya o no habla bien de él frente a otros superiores, se siente solo y preocupado, pensando que no lo valoran.",
  pregunta_5: "Si siente que su jefe no lo trata con respeto o no valora su trabajo, le causa mucho estrés.",
  pregunta_6: "No sentirse parte de un equipo de trabajo unido le hace sentirse aislado y preocupado por no poder colaborar eficientemente con otros.",
  pregunta_7: "Cuando su equipo de trabajo no lo apoya en alcanzar sus metas, se siente estresado y frustrado.",
  pregunta_8: "Sentir que su equipo de trabajo no tiene buena reputación dentro de la empresa le provoca estrés, ya que desea que su equipo sea valorado.",
  pregunta_9: "La falta de claridad en la forma de trabajar dentro de la empresa le genera confusión y estrés.",
  pregunta_10: "Las políticas impuestas por la gerencia que dificultan su trabajo le causan frustración y estrés.",
  pregunta_11: "Cuando siente que no tiene suficiente control sobre su trabajo, igual que sus compañeros, se siente estresado y sin poder sobre lo que sucede.",
  pregunta_12: "Si percibe que su supervisor no se preocupa por su bienestar, se siente menospreciado y estresado.",
  pregunta_13: "No contar con el conocimiento técnico necesario para competir en la empresa le genera una sensación de inseguridad y estrés.",
  pregunta_14: "No tener un espacio privado para trabajar en tranquilidad le incomoda y le estresa.",
  pregunta_15: "La carga de papeleo excesivo en la empresa le resulta abrumadora y le provoca estrés.",
  pregunta_16: "La falta de confianza de su supervisor en su trabajo le hace sentir inseguro y estresado.",
  pregunta_17: "Si su equipo de trabajo está desorganizado, se siente ansioso porque no puede trabajar de manera efectiva.",
  pregunta_18: "Cuando su equipo no lo protege de las demandas laborales injustas de los jefes, se siente desamparado y estresado.",
  pregunta_19: "La falta de dirección clara y objetivos definidos en la empresa le genera estrés e incertidumbre.",
  pregunta_20: "Si siente que su equipo lo presiona demasiado, se estresa porque siente que no puede cumplir con todo.",
  pregunta_21: "Cuando no respetan a sus superiores, a él mismo, o a las personas que están por debajo de él, siente estrés e incomodidad.",
  pregunta_22: "Si su equipo de trabajo no le brinda apoyo técnico cuando lo necesita, se siente frustrado y estresado.",
  pregunta_23: "La falta de tecnología adecuada para realizar un trabajo de calidad le genera una gran presión y estrés."
};

// Crear un programa de usuario y generar reporte GPT
exports.createAndGenerateReport = async (req, res) => {
  const { user_id } = req.params; // Obtener el user_id de los parámetros de la URL
  let data = req.body; // Obtener el map pasado en el cuerpo de la solicitud

  // Eliminar 'estado' y 'user_id' del map
  delete data['estado'];
  delete data['user_id'];

  try {
    // Obtener datos del usuario, nivel de estrés y respuestas
    const estresSession = await UserEstresSession.findOne({ where: { user_id }, attributes: ['estres_nivel_id'] });
    const userResponse = await UserResponse.findOne({ where: { user_id } });
    const user = await User.findOne({ where: { id: user_id }, attributes: ['username', 'email'] });

    if (!estresSession || !userResponse || !user) {
      return res.status(404).json({ error: 'No se encontraron los datos requeridos del usuario.' });
    }

    const estres_nivel = estresNivelMap[estresSession.estres_nivel_id] || 'Desconocido';
    const age_range = ageRangeMap[userResponse.age_range_id] || 'Desconocido';
    const hierarchical_level = hierarchicalLevelMap[userResponse.hierarchical_level_id] || 'Desconocido';
    const responsability_level = responsabilityLevelMap[userResponse.responsability_level_id] || 'Desconocido';
    const gender = genderMap[userResponse.gender_id] || 'Desconocido';

    // Respuestas del usuario al test de estrés
    const preguntasResueltas = Object.keys(data).map((pregunta, index) => ({
      pregunta: preguntasDefiniciones[pregunta],
      respuesta: respuestaMap[data[pregunta]] || "No especificado"
    }));

    // Generar un resumen de las respuestas del usuario para incluir en el prompt
    const resumenRespuestas = preguntasResueltas.map((p, index) => {
      return `Pregunta ${index + 1}: ${p.pregunta} - Respuesta: ${p.respuesta}`;
    }).join('\n');

    // Dividir prompts en tres partes
    const prompts = [
      {
        seccion: 'Días 1-7',
        tipo: 'Técnicas de relajación',
        prompt: `
          Genera un programa personalizado para los días 1 a 7 (Técnicas de Relajación).
          Este programa debe:
          - Ser gradual y compatible con las actividades cotidianas del usuario.
          - Contener técnicas realizables sin necesidad de elementos externos.
          - Incluir un mínimo de 15 pasos detallados y fáciles de seguir por técnica.
    
          Responde en formato JSON estrictamente válido:
          [
            {
              "día": (número del día, tipo int),
              "nombre_técnica": "Nombre de la técnica",
              "tipo_técnica": "Subtítulo breve de la técnica",
              "descripción": "Inicia motivando al usuario por su nombre y explica regularmente la técnica.",
              "guía": ["Paso 1: Descripción del paso...", "Paso 2: Descripción del paso...", ..., "Paso 15: Descripción del paso..."]
            }
          ]
    
          Datos del usuario:
          - Nombre: ${user.username}
          - Edad: ${age_range}
          - Nivel jerárquico: ${hierarchical_level}
          - Nivel de responsabilidad: ${responsability_level}
          - Género: ${gender}
          - Nivel de estrés: ${estres_nivel}
    
          Respuestas al test de estrés:
          ${resumenRespuestas}
    
          Nota: Solo responde con el JSON válido.
        `
      },
      {
        seccion: 'Días 8-14',
        tipo: 'Reestructuración cognitiva',
        prompt: `
          Genera un programa personalizado para los días 8 a 14 (Reestructuración Cognitiva).
          Este programa debe:
          - Ser gradual y compatible con las actividades cotidianas del usuario.
          - Contener técnicas realizables sin necesidad de elementos externos.
          - Incluir un mínimo de 15 pasos detallados y fáciles de seguir por técnica.
    
          Responde en formato JSON estrictamente válido:
          [
            {
              "día": (número del día, tipo int),
              "nombre_técnica": "Nombre de la técnica",
              "tipo_técnica": "Subtítulo breve de la técnica",
              "descripción": "Inicia motivando al usuario por su nombre y explica regularmente la técnica.",
              "guía": ["Paso 1: Descripción del paso...", "Paso 2: Descripción del paso...", ..., "Paso 15: Descripción del paso..."]
            }
          ]
    
          Datos del usuario:
          - Nombre: ${user.username}
          - Edad: ${age_range}
          - Nivel jerárquico: ${hierarchical_level}
          - Nivel de responsabilidad: ${responsability_level}
          - Género: ${gender}
          - Nivel de estrés: ${estres_nivel}
    
          Respuestas al test de estrés:
          ${resumenRespuestas}
    
          Nota: Solo responde con el JSON válido.
        `
      },
      {
        seccion: 'Días 15-21',
        tipo: 'Técnicas de PNL',
        prompt: `
          Genera un programa personalizado para los días 15 a 21 (Técnicas de PNL).
          Este programa debe:
          - Ser gradual y compatible con las actividades cotidianas del usuario.
          - Contener técnicas realizables sin necesidad de elementos externos.
          - Incluir un mínimo de 15 pasos detallados y fáciles de seguir por técnica.
    
          Responde en formato JSON estrictamente válido:
          [
            {
              "día": (número del día, tipo int),
              "nombre_técnica": "Nombre de la técnica",
              "tipo_técnica": "Subtítulo breve de la técnica",
              "descripción": "Inicia motivando al usuario por su nombre y explica regularmente la técnica.",
              "guía": ["Paso 1: Descripción del paso...", "Paso 2: Descripción del paso...", ..., "Paso 15: Descripción del paso..."]
            }
          ]
    
          Datos del usuario:
          - Nombre: ${user.username}
          - Edad: ${age_range}
          - Nivel jerárquico: ${hierarchical_level}
          - Nivel de responsabilidad: ${responsability_level}
          - Género: ${gender}
          - Nivel de estrés: ${estres_nivel}
    
          Respuestas al test de estrés:
          ${resumenRespuestas}
    
          Nota: Solo responde con el JSON válido.
        `
      }
    ];

    // Generar respuestas de GPT para cada sección
    const programas = [];
    for (const { seccion, prompt } of prompts) {
      const gptResponse = await getBotResponse(prompt, user_id);
      console.log(`Respuesta de GPT para ${seccion}:`, gptResponse);

      // Validar y parsear JSON
      try {
        programas.push(...JSON.parse(gptResponse));
      } catch (error) {
        console.error(`Error al parsear JSON para ${seccion}:`, error);
        return res.status(500).json({ error: `Error al procesar JSON para ${seccion}` });
      }
    }

    // Preparar los registros para insertar en la base de datos
    const currentDate = new Date(); // Fecha actual
    const registros = programas.map(item => ({
      user_id: user_id,
      dia: item.día,
      nombre_tecnica: item.nombre_técnica,
      tipo_tecnica: item.tipo_técnica,
      descripcion: item.descripción,
      guia: JSON.stringify(item.guía),
      start_date: item.día === 1 ? currentDate : null,
      completed_date: null,
      comentario: item.comentario || null,
      estrellas: item.estrellas || 3
    }));

    // Insertar registros en la base de datos
    await UserPrograma.bulkCreate(registros);
    console.log('Registros insertados correctamente en la tabla UserPrograma');

    res.status(200).json({
      message: 'Programa generado correctamente.',
      programas
    });

  } catch (error) {
    console.error('Error al generar el programa del usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};



exports.getByUserId = async (req, res) => {
  const { user_id } = req.params;  // Obtener el user_id de los parámetros
  try {
    const userProgramas = await UserPrograma.findAll({
      where: { user_id },  // Filtrar por user_id
      include: [{
        model: EstresTecnicas,  // Incluir la tabla relacionada 'EstresTecnicas'
        as: 'tecnica',  // Alias para acceder a los datos de EstresTecnicas
        attributes: ['id', 'nombre', 'mensaje', 'steps', 'tipo', 'icon']  // Especificar los campos que quieres obtener
      }]
    });
    
    if (userProgramas.length === 0) {
      return res.status(404).json({ error: 'No se encontraron programas para este usuario' });
    }
    
    res.status(200).json(userProgramas);
  } catch (error) {
    console.error('Error al obtener los programas de usuario:', error);  // Imprimir el error en la consola
    res.status(500).json({ error: `Error al obtener los programas de usuario: ${error.message}` });  // Enviar el mensaje de error
  }
};

// Actualizar un registro de UserPrograma por user_id y estrestecnicas_id
exports.updateByUserAndTecnica = async (req, res) => {
  const { user_id, id } = req.params; // Obtener user_id y estrestecnicas_id de los parámetros
  const { comentario, estrellas } = req.body; // Obtener los campos que se quieren actualizar del body

  try {
    // Buscar el registro basado en user_id y estrestecnicas_id
    const userPrograma = await UserPrograma.findOne({
      where: {
        user_id: user_id,
        id: id
      }
    });

    if (!userPrograma) {
      return res.status(404).json({ error: 'Programa no encontrado' });
    }

    // Actualizar los campos comentario y estrellas si se pasan en el body
    userPrograma.comentario = comentario || userPrograma.comentario;
    userPrograma.estrellas = estrellas !== undefined ? estrellas : userPrograma.estrellas;

    // Guardar los cambios en la base de datos
    if (userPrograma.completed_date == null) userPrograma.completed_date = new Date();

    await userPrograma.save();

    const nextProgram = await UserPrograma.findOne({
      where: {
        user_id: user_id,
        dia: userPrograma.dia + 1
      }
    });

    if (nextProgram){
      nextProgram.start_date = addDays(new Date(), 1);
      await nextProgram.save();
    }
    
    res.status(200).json({
      message: 'Programa actualizado con éxito',
      userPrograma
    });
  } catch (error) {
    console.error('Error al actualizar el programa de usuario:', error);
    res.status(500).json({ error: 'Error al actualizar el programa de usuario' });
  }
};


// Obtener todos los registros de UserPrograma filtrados por user_id y ordenados por 'dia'
exports.getByUserIdAndOrderByDia = async (req, res) => {
  const { user_id } = req.params;
  try {
    // Obtener los programas del usuario
    const userProgramas = await UserPrograma.findAll({
      where: { user_id },
      order: [['dia', 'ASC']]
    });

    if (userProgramas.length === 0) {
      return res.status(404).json({ error: 'No se encontraron programas para este usuario' });
    }

    // Si necesitas los datos de EstresTecnicas por separado, puedes hacer una consulta adicional
    const estresTecnicas = await EstresTecnicas.findAll(); // Aquí se recuperan todas las técnicas, puedes agregar condiciones si es necesario

    res.status(200).json({ userProgramas, estresTecnicas }); // Responder con los datos de ambas tablas
  } catch (error) {
    console.error('Error al obtener los programas de usuario:', error);
    res.status(500).json({ error: `Error al obtener los programas de usuario: ${error.message}` });
  }
};



// Obtener todos los registros de UserPrograma junto con los detalles de EstresTecnicas
exports.getAll = async (req, res) => {
  try {
    const userProgramas = await UserPrograma.findAll({
      include: [{
        model: EstresTecnicas,  // Incluir la tabla relacionada 'EstresTecnicas'
        as: 'tecnica',  // Alias para acceder a los datos de EstresTecnicas
        attributes: ['id', 'nombre', 'mensaje', 'steps', 'tipo', 'icon']  // Especificar los campos que quieres obtener
      }]
    });
    res.status(200).json(userProgramas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los programas de usuario' });
  }
};
// Obtener un registro de UserPrograma por ID
exports.getById = async (req, res) => {
  const { id } = req.params;
  try {
    const userPrograma = await UserPrograma.findByPk(id);
    if (!userPrograma) {
      return res.status(404).json({ error: 'Programa no encontrado' });
    }
    res.status(200).json(userPrograma);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el programa de usuario' });
  }
};

// Crear un nuevo registro en UserPrograma
exports.create = async (req, res) => {
  const { user_id, estrestecnicas_id, dia } = req.body;
  try {
    const newUserPrograma = await UserPrograma.create({
      user_id,
      estrestecnicas_id,
      dia
    });
    res.status(201).json(newUserPrograma);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el programa de usuario' });
  }
};

// Actualizar un registro de UserPrograma por ID
exports.update = async (req, res) => {
  const { id } = req.params;
  const { user_id, estrestecnicas_id, dia } = req.body;
  try {
    const userPrograma = await UserPrograma.findByPk(id);
    if (!userPrograma) {
      return res.status(404).json({ error: 'Programa no encontrado' });
    }

    userPrograma.user_id = user_id || userPrograma.user_id;
    userPrograma.estrestecnicas_id = estrestecnicas_id || userPrograma.estrestecnicas_id;
    userPrograma.dia = dia || userPrograma.dia;

    await userPrograma.save();
    res.status(200).json(userPrograma);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el programa de usuario' });
  }
};

// Eliminar un registro de UserPrograma por ID
exports.delete = async (req, res) => {
  const { id } = req.params;
  try {
    const userPrograma = await UserPrograma.findByPk(id);
    if (!userPrograma) {
      return res.status(404).json({ error: 'Programa no encontrado' });
    }

    await userPrograma.destroy();
    res.status(204).json({ message: 'Programa eliminado con éxito' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el programa de usuario' });
  }
};