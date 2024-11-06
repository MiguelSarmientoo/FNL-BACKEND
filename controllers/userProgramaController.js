const UserPrograma = require('../models/userprograma');
const EstresTecnicas = require('../models/estrestecnicas');
const UserEstresSession = require('../models/userestressession');
const UserResponse = require('../models/user_responses');
const User = require('../models/user');
const { getBotResponse } = require('./openaiController');
const moment = require('moment');



// Mapeo para los valores de estrés, rango de edad, nivel jerárquico, nivel de responsabilidad y género
const estresNivelMap = {
  1: 'Leve',
  2: 'Moderado',
  3: 'Alto'
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
  4: 'Analista'
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
    // 1. Obtener el registro de UserEstresSession
    const estresSession = await UserEstresSession.findOne({
      where: { user_id },
      attributes: ['estres_nivel_id'] // Solo obtener estres_nivel_id
    });

    if (!estresSession) {
      return res.status(404).json({ error: 'No se encontró la sesión de estrés para el usuario.' });
    }

    const estres_nivel_id = estresNivelMap[estresSession.estres_nivel_id] || 'Desconocido';

    // 2. Obtener el registro de UserResponse
    const userResponse = await UserResponse.findOne({
      where: { user_id }
    });

    if (!userResponse) {
      return res.status(404).json({ error: 'No se encontraron respuestas de usuario.' });
    }

    // Mapeo de los valores de UserResponse
    const age_range = ageRangeMap[userResponse.age_range_id] || 'Desconocido';
    const hierarchical_level = hierarchicalLevelMap[userResponse.hierarchical_level_id] || 'Desconocido';
    const responsability_level = responsabilityLevelMap[userResponse.responsability_level_id] || 'Desconocido';
    const gender = genderMap[userResponse.gender_id] || 'Desconocido';

    // 3. Obtener los datos del usuario de la tabla Users
    const user = await User.findOne({
      where: { id: user_id },
      attributes: ['username', 'email']
    });

    if (!user) {
      return res.status(404).json({ error: 'No se encontraron los datos del usuario.' });
    }

    // 4. Transformar el map de preguntas
    const preguntasResueltas = Object.keys(data).map((pregunta, index) => {
      const respuesta = respuestaMap[data[pregunta]];
      return {
        pregunta: preguntasDefiniciones[pregunta],
        respuesta: respuesta || "No especificado"
      };
    });

    // 5. Obtener todas las técnicas de la tabla EstresTecnicas
    const tecnicas = await EstresTecnicas.findAll({
      attributes: ['id', 'nombre', 'tipotecnicas_id']
    });

    // Mapeo de técnicas
    const tecnicasFormatted = tecnicas.map(tecnica => {
      const tipoDescripcion = tecnica.tipotecnicas_id === 1 ? 'Técnica de Relajación' :
                              tecnica.tipotecnicas_id === 2 ? 'Reestructuración Cognitiva' :
                              tecnica.tipotecnicas_id === 3 ? 'Técnica de PNL' : 'Desconocido';

      return {
        id: tecnica.id,
        nombre: tecnica.nombre,
        tipotecnicas_id: tecnica.tipotecnicas_id
      };
    });

    // 6. Generar el reporte usando la integración con GPT
    const prompt = `
      Basado en los detalles del usuario y las técnicas proporcionadas, genera un plan de 21 días con las siguientes condiciones:
      - Selecciona 7 técnicas de tipo 1 (Técnicas de Relajación), 7 de tipo 2 (Reestructuración Cognitiva) y 7 de tipo 3 (Técnicas de PNL) pero tienes que varias, osea de todas las opciones que tienes en cada tipo debes elegir la que mas le convenga al usuario por favor no me des siempre las mismas respuestas.
      Datos del usuario:
      - Nivel de estrés: ${estres_nivel_id}
      - Rango de edad: ${age_range}
      - Nivel jerárquico: ${hierarchical_level}
      - Nivel de responsabilidad: ${responsability_level}
      - Género: ${gender}
      - Respuestas a las preguntas:
      ${preguntasResueltas.map((p, index) => `Pregunta ${index + 1}: ${p.pregunta} - Respuesta: ${p.respuesta}`).join('\n')}
      - Aquí están todas las técnicas disponibles para seleccionar (Tipo 1 = Técnica de Relajación, Tipo 2 = Reestructuración Cognitiva, Tipo 3 = Técnica de PNL):
      ${tecnicasFormatted.map(t => `ID: ${t.id}, Nombre: ${t.nombre}, Tipo: ${t.tipotecnicas_id}`).join('\n')}

      Una vez que tengas el plan para este usuario tu respuesta a este prompt solo sera el plan en este formato Json sin nada adicional solo un Json con el formato que te mostrare a continuación (Recuerda elegir las 7 tecnicas de cada tipo que mas le convengan a el usuario segun los datos proporcionados, los 7 primeros dias solo puedes elegir las tecnicas que mas les convegan al usuario pero tipo 1, las segunda semana las que mas que convengan al usuario pero tipo 2 y la tercera y ultima semana solo tecnicas de tipo 3 tambien las que mas le convengan al usuario. Recuerda que tendremos muchos usuario por lo tanto cada un tendra problemas diferentes de como se debe tratar por eso de estoy dando todos los datos del usuario:
      (Por otro lado debo dejarte claro que debes elegir lo mejor para el usuario, no ve vas a pasar siempre por ejemplo numero conescutico de id de las tecnicas es no me sirve debes variar y darme lo mejor para el usuario en el orden conveniete que debe llevar las tecnicas que selecciones)
      {
        Id : (num de la tecnica, tipo int),
        Dia: (el dia que se realizara esta tecnica de los 21 dias, tipo int),
      },
      asi sucesivamente hasta completar los 21 dias ...
    `;

    const gptResponse = await getBotResponse(prompt, user_id);
    console.log('Respuesta completa de GPT:', gptResponse);

    // 7. Extraer el JSON de la respuesta de GPT de manera flexible
    let programaUsuario;
    try {
      // Buscar cualquier bloque de texto que parezca un JSON en la respuesta
      const jsonStartIndex = gptResponse.indexOf('[');
      const jsonEndIndex = gptResponse.lastIndexOf(']') + 1;

      if (jsonStartIndex !== -1 && jsonEndIndex !== -1) {
        const jsonString = gptResponse.slice(jsonStartIndex, jsonEndIndex);
        programaUsuario = JSON.parse(jsonString); // Parseamos el bloque JSON extraído
      } else {
        throw new Error("No se encontró un bloque JSON válido en la respuesta de GPT.");
      }
    } catch (error) {
      console.error('Error al parsear la respuesta de GPT:', error);
      return res.status(500).json({ error: 'Error al procesar la respuesta de GPT.' });
    }

    // Imprime el JSON extraído de la respuesta GPT para verificar
    console.log('JSON extraído de la respuesta GPT:', JSON.stringify(programaUsuario, null, 2));

    const startDate = moment.tz('America/Lima').format('YYYY-MM-DD HH:mm:ss');

    const registros = programaUsuario.map(item => ({
      user_id: user_id,
      estrestecnicas_id: item.Id,  // ID del JSON
      dia: item.Dia,  // Día del JSON
      start_date: startDate 
    }));

    // Imprime los registros que serán insertados
    console.log('Registros a insertar en UserPrograma:', JSON.stringify(registros, null, 2));

    try {
      await UserPrograma.bulkCreate(registros);
      console.log('Registros insertados correctamente en la tabla UserPrograma');
    } catch (error) {
      console.error('Error al insertar los registros en UserPrograma:', error);
    }

    res.status(200).json({
      message: 'Reporte y programa generados correctamente, y registros insertados en UserPrograma.',
      programaUsuario
    });


  } catch (error) {
    console.error('Error al generar el reporte del usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

/*
// Crear un programa de usuario y generar reporte GPT
exports.createAndGenerateReport = async (req, res) => {
  const { user_id } = req.params; // Obtener el user_id de los parámetros de la URL
  let data = req.body; // Obtener el map pasado en el cuerpo de la solicitud

  // Eliminar 'estado' y 'user_id' del map
  delete data['estado'];
  delete data['user_id'];

  try {
    // 1. Obtener el registro de UserEstresSession
    const estresSession = await UserEstresSession.findOne({
      where: { user_id },
      attributes: ['estres_nivel_id'] // Solo obtener estres_nivel_id
    });

    if (!estresSession) {
      return res.status(404).json({ error: 'No se encontró la sesión de estrés para el usuario.' });
    }

    const estres_nivel_id = estresNivelMap[estresSession.estres_nivel_id] || 'Desconocido';

    // 2. Obtener el registro de UserResponse
    const userResponse = await UserResponse.findOne({
      where: { user_id }
    });

    if (!userResponse) {
      return res.status(404).json({ error: 'No se encontraron respuestas de usuario.' });
    }

    // Mapeo de los valores de UserResponse
    const age_range = ageRangeMap[userResponse.age_range_id] || 'Desconocido';
    const hierarchical_level = hierarchicalLevelMap[userResponse.hierarchical_level_id] || 'Desconocido';
    const responsability_level = responsabilityLevelMap[userResponse.responsability_level_id] || 'Desconocido';
    const gender = genderMap[userResponse.gender_id] || 'Desconocido';

    // 3. Obtener los datos del usuario de la tabla Users
    const user = await User.findOne({
      where: { id: user_id },
      attributes: ['username', 'email']
    });

    if (!user) {
      return res.status(404).json({ error: 'No se encontraron los datos del usuario.' });
    }

    // 4. Transformar el map de preguntas
    const preguntasResueltas = Object.keys(data).map((pregunta, index) => {
      const respuesta = respuestaMap[data[pregunta]];
      return {
        pregunta: preguntasDefiniciones[pregunta],
        respuesta: respuesta || "No especificado"
      };
    });

    // 5. Generar técnicas de estrés personalizadas
    const techniquesResponse = await generadorEstresTecnicas(req);
    if (!techniquesResponse || techniquesResponse.error || !Array.isArray(techniquesResponse.data)) {
      console.error('Error al generar técnicas de estrés:', techniquesResponse?.error);
      return res.status(500).json({ error: 'Error al generar técnicas de estrés.' });
    }

    // 6. Obtener todas las técnicas generadas
    const tecnicasGeneradas = techniquesResponse.data;

    // Verifica si no hay técnicas generadas
    if (!tecnicasGeneradas || tecnicasGeneradas.length === 0) {
      return res.status(404).json({ error: 'No se encontraron técnicas de estrés generadas.' });
    }

    // 7. Definir tecnicasFormatted
    const tecnicasFormatted = tecnicasGeneradas.map(tecnica => ({
      id: tecnica.id,
      nombre: tecnica.nombre,
      tipoDescripcion: tecnica.tipotecnicas_id === 1 ? 'Técnica de Relajación' :
                       tecnica.tipotecnicas_id === 2 ? 'Reestructuración Cognitiva' :
                       tecnica.tipotecnicas_id === 3 ? 'Técnica de PNL' : 'Desconocido'
    }));

    // 8. Generar el reporte usando la integración con GPT
    const prompt = `
      Basado en los detalles del usuario y las técnicas proporcionadas, genera un plan de 21 días con las siguientes condiciones:
      - Selecciona 7 técnicas de tipo 1 (Técnicas de Relajación), 7 de tipo 2 (Reestructuración Cognitiva) y 7 de tipo 3 (Técnicas de PNL) pero tienes que varias, osea de todas las opciones que tienes en cada tipo debes elegir la que mas le convenga al usuario por favor no me des siempre las mismas respuestas.
      Datos del usuario:
      - Nivel de estrés: ${estres_nivel_id}
      - Rango de edad: ${age_range}
      - Nivel jerárquico: ${hierarchical_level}
      - Nivel de responsabilidad: ${responsability_level}
      - Género: ${gender}
      - Respuestas a las preguntas:
      ${preguntasResueltas.map((p, index) => `Pregunta ${index + 1}: ${p.pregunta} - Respuesta: ${p.respuesta}`).join('\n')}
      - Aquí están todas las técnicas disponibles para seleccionar (Tipo 1 = Técnica de Relajación, Tipo 2 = Reestructuración Cognitiva, Tipo 3 = Técnica de PNL):
      ${tecnicasFormatted.map(t => `ID: ${t.id}, Nombre: ${t.nombre}, Tipo: ${t.tipotecnicas_id}`).join('\n')}

      Una vez que tengas el plan para este usuario tu respuesta a este prompt solo sera el plan en este formato Json sin nada adicional solo un Json con el formato que te mostrare a continuación (Recuerda elegir las 7 tecnicas de cada tipo que mas le convengan a el usuario segun los datos proporcionados, los 7 primeros dias solo puedes elegir las tecnicas que mas les convegan al usuario pero tipo 1, las segunda semana las que mas que convengan al usuario pero tipo 2 y la tercera y ultima semana solo tecnicas de tipo 3 tambien las que mas le convengan al usuario. Recuerda que tendremos muchos usuario por lo tanto cada un tendra problemas diferentes de como se debe tratar por eso de estoy dando todos los datos del usuario:
      (Por otro lado debo dejarte claro que debes elegir lo mejor para el usuario, no ve vas a pasar siempre por ejemplo numero conescutico de id de las tecnicas es no me sirve debes variar y darme lo mejor para el usuario en el orden conveniete que debe llevar las tecnicas que selecciones)
      {
        Id : (num de la tecnica, tipo int),
        Dia: (el dia que se realizara esta tecnica de los 21 dias, tipo int),
      },
      asi sucesivamente hasta completar los 21 dias ...
    `;
    const gptResponse = await getBotResponse(prompt, user_id);
    console.log('Respuesta completa de GPT:', gptResponse);

    // 9. Extraer el JSON de la respuesta de GPT de manera flexible
    let programaUsuario;
    try {
      const jsonStartIndex = gptResponse.indexOf('[');
      const jsonEndIndex = gptResponse.lastIndexOf(']') + 1;

      if (jsonStartIndex !== -1 && jsonEndIndex !== -1) {
        const jsonString = gptResponse.slice(jsonStartIndex, jsonEndIndex);
        programaUsuario = JSON.parse(jsonString); // Parseamos el bloque JSON extraído
      } else {
        throw new Error("No se encontró un bloque JSON válido en la respuesta de GPT.");
      }
    } catch (error) {
      console.error('Error al parsear la respuesta de GPT:', error);
      return res.status(500).json({ error: 'Error al procesar la respuesta de GPT.' });
    }

    // Imprime el JSON extraído de la respuesta GPT para verificar
    console.log('JSON extraído de la respuesta GPT:', JSON.stringify(programaUsuario, null, 2));

    const startDate = moment.tz('America/Lima').format('YYYY-MM-DD HH:mm:ss');

    const registros = programaUsuario.map(item => ({
      user_id: user_id,
      estrestecnicas_id: item.Id,  // ID del JSON
      dia: item.Dia,  // Día del JSON
      start_date: startDate 
    }));

    // Imprime los registros que serán insertados
    console.log('Registros a insertar en UserPrograma:', JSON.stringify(registros, null, 2));

    // Insertar registros en UserPrograma
    await UserPrograma.bulkCreate(registros);
    console.log('Registros insertados correctamente en la tabla UserPrograma');

    // Respuesta final
    return res.status(200).json({
      message: 'Reporte y programa generados correctamente, y registros insertados en UserPrograma.',
      programaUsuario
    });

  } catch (error) {
    console.error('Error al generar el reporte del usuario:', error);
    // Asegúrate de que solo se envíe una respuesta en caso de error
    if (!res.headersSent) {
      return res.status(500).json({ error: 'Error interno del servidor.' });
    }
  }
};

exports.createAndGenerateReport = async (req, res) => {
  const { user_id } = req.params; // Obtener el user_id de los parámetros de la URL
  let data = req.body; // Obtener el map pasado en el cuerpo de la solicitud

  // Eliminar 'estado' y 'user_id' del map
  delete data['estado'];
  delete data['user_id'];

  try {
    // 1. Obtener el registro de UserEstresSession
    const estresSession = await UserEstresSession.findOne({
      where: { user_id },
      attributes: ['estres_nivel_id'] // Solo obtener estres_nivel_id
    });

    if (!estresSession) {
      return res.status(404).json({ error: 'No se encontró la sesión de estrés para el usuario.' });
    }

    const estres_nivel_id = estresNivelMap[estresSession.estres_nivel_id] || 'Desconocido';

    // 2. Obtener el registro de UserResponse
    const userResponse = await UserResponse.findOne({
      where: { user_id }
    });

    if (!userResponse) {
      return res.status(404).json({ error: 'No se encontraron respuestas de usuario.' });
    }

    // Mapeo de los valores de UserResponse
    const age_range = ageRangeMap[userResponse.age_range_id] || 'Desconocido';
    const hierarchical_level = hierarchicalLevelMap[userResponse.hierarchical_level_id] || 'Desconocido';
    const responsability_level = responsabilityLevelMap[userResponse.responsability_level_id] || 'Desconocido';
    const gender = genderMap[userResponse.gender_id] || 'Desconocido';

    // 3. Obtener los datos del usuario de la tabla Users
    const user = await User.findOne({
      where: { id: user_id },
      attributes: ['username', 'email']
    });

    if (!user) {
      return res.status(404).json({ error: 'No se encontraron los datos del usuario.' });
    }

    // 4. Transformar el map de preguntas
    const preguntasResueltas = Object.keys(data).map((pregunta, index) => {
      const respuesta = respuestaMap[data[pregunta]];
      return {
        pregunta: preguntasDefiniciones[pregunta],
        respuesta: respuesta || "No especificado"
      };
    });

    const techniquesResponse = await generadorEstresTecnicas(req, res);
    if (!techniquesResponse || techniquesResponse.error || !Array.isArray(techniquesResponse.data)) {
      console.error('Error al generar técnicas de estrés:', techniquesResponse?.error);
      return res.status(500).json({ error: 'Error al generar técnicas de estrés.' });
    }
    
    // 6. Obtener todas las técnicas generadas
    const tecnicasGeneradas = techniquesResponse.data;
    
    // Verifica si no hay técnicas generadas
    if (!tecnicasGeneradas || tecnicasGeneradas.length === 0) {
      return res.status(404).json({ error: 'No se encontraron técnicas de estrés generadas.' });
    }
    // 7. Definir tecnicasFormatted
    const tecnicasFormatted = tecnicasGeneradas.map(tecnica => ({
      id: tecnica.id,
      nombre: tecnica.nombre,
      tipoDescripcion: tecnica.tipotecnicas_id === 1 ? 'Técnica de Relajación' :
                       tecnica.tipotecnicas_id === 2 ? 'Reestructuración Cognitiva' :
                       tecnica.tipotecnicas_id === 3 ? 'Técnica de PNL' : 'Desconocido'
    }));

    // 6. Generar el reporte usando la integración con GPT
    const prompt = `
      Basado en los detalles del usuario y las técnicas proporcionadas, genera un plan de 21 días con las siguientes condiciones:
      - Selecciona 7 técnicas de tipo 1 (Técnicas de Relajación), 7 de tipo 2 (Reestructuración Cognitiva) y 7 de tipo 3 (Técnicas de PNL) pero tienes que varias, osea de todas las opciones que tienes en cada tipo debes elegir la que mas le convenga al usuario por favor no me des siempre las mismas respuestas.
      Datos del usuario:
      - Nivel de estrés: ${estres_nivel_id}
      - Rango de edad: ${age_range}
      - Nivel jerárquico: ${hierarchical_level}
      - Nivel de responsabilidad: ${responsability_level}
      - Género: ${gender}
      - Respuestas a las preguntas:
      ${preguntasResueltas.map((p, index) => `Pregunta ${index + 1}: ${p.pregunta} - Respuesta: ${p.respuesta}`).join('\n')}
      - Aquí están todas las técnicas disponibles para seleccionar (Tipo 1 = Técnica de Relajación, Tipo 2 = Reestructuración Cognitiva, Tipo 3 = Técnica de PNL):
      ${tecnicasFormatted.map(t => `ID: ${t.id}, Nombre: ${t.nombre}, Tipo: ${t.tipotecnicas_id}`).join('\n')}

      Una vez que tengas el plan para este usuario tu respuesta a este prompt solo sera el plan en este formato Json sin nada adicional solo un Json con el formato que te mostrare a continuación (Recuerda elegir las 7 tecnicas de cada tipo que mas le convengan a el usuario segun los datos proporcionados, los 7 primeros dias solo puedes elegir las tecnicas que mas les convegan al usuario pero tipo 1, las segunda semana las que mas que convengan al usuario pero tipo 2 y la tercera y ultima semana solo tecnicas de tipo 3 tambien las que mas le convengan al usuario. Recuerda que tendremos muchos usuario por lo tanto cada un tendra problemas diferentes de como se debe tratar por eso de estoy dando todos los datos del usuario:
      (Por otro lado debo dejarte claro que debes elegir lo mejor para el usuario, no ve vas a pasar siempre por ejemplo numero conescutico de id de las tecnicas es no me sirve debes variar y darme lo mejor para el usuario en el orden conveniete que debe llevar las tecnicas que selecciones)
      {
        Id : (num de la tecnica, tipo int),
        Dia: (el dia que se realizara esta tecnica de los 21 dias, tipo int),
      },
      asi sucesivamente hasta completar los 21 dias ...
    `;

    const gptResponse = await getBotResponse(prompt, user_id);
    console.log('Respuesta completa de GPT:', gptResponse);

    // 7. Extraer el JSON de la respuesta de GPT de manera flexible
    let programaUsuario;
    try {
      // Buscar cualquier bloque de texto que parezca un JSON en la respuesta
      const jsonStartIndex = gptResponse.indexOf('[');
      const jsonEndIndex = gptResponse.lastIndexOf(']') + 1;

      if (jsonStartIndex !== -1 && jsonEndIndex !== -1) {
        const jsonString = gptResponse.slice(jsonStartIndex, jsonEndIndex);
        programaUsuario = JSON.parse(jsonString); // Parseamos el bloque JSON extraído
      } else {
        throw new Error("No se encontró un bloque JSON válido en la respuesta de GPT.");
      }
    } catch (error) {
      console.error('Error al parsear la respuesta de GPT:', error);
      return res.status(500).json({ error: 'Error al procesar la respuesta de GPT.' });
    }

    // Imprime el JSON extraído de la respuesta GPT para verificar
    console.log('JSON extraído de la respuesta GPT:', JSON.stringify(programaUsuario, null, 2));

    const startDate = moment.tz('America/Lima').format('YYYY-MM-DD HH:mm:ss');

    const registros = programaUsuario.map(item => ({
      user_id: user_id,
      estrestecnicas_id: item.Id,  // ID del JSON
      dia: item.Dia,  // Día del JSON
      start_date: startDate 
    }));

    // Imprime los registros que serán insertados
    console.log('Registros a insertar en UserPrograma:', JSON.stringify(registros, null, 2));

    try {
      await UserPrograma.bulkCreate(registros);
      console.log('Registros insertados correctamente en la tabla UserPrograma');
    } catch (error) {
      console.error('Error al insertar los registros en UserPrograma:', error);
    }

    res.status(200).json({
      message: 'Reporte y programa generados correctamente, y registros insertados en UserPrograma.',
      programaUsuario
    });


  } catch (error) {
    console.error('Error al generar el reporte del usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};


exports.createAndGenerateReport = async (req, res) => {
  const { user_id } = req.params;
  let data = req.body;

  // Eliminar 'estado' y 'user_id' del map
  delete data['estado'];
  delete data['user_id'];

  try {
    // 1. Obtener el registro de UserEstresSession
    const estresSession = await UserEstresSession.findOne({
      where: { user_id },
      attributes: ['estres_nivel_id']
    });

    if (!estresSession) {
      return res.status(404).json({ error: 'No se encontró la sesión de estrés para el usuario.' });
    }

    const estres_nivel_id = estresNivelMap[estresSession.estres_nivel_id] || 'Desconocido';

    // 2. Obtener el registro de UserResponse
    const userResponse = await UserResponse.findOne({ where: { user_id } });
    if (!userResponse) {
      return res.status(404).json({ error: 'No se encontraron respuestas de usuario.' });
    }

    // Mapeo de los valores de UserResponse
    const age_range = ageRangeMap[userResponse.age_range_id] || 'Desconocido';
    const hierarchical_level = hierarchicalLevelMap[userResponse.hierarchical_level_id] || 'Desconocido';
    const responsability_level = responsabilityLevelMap[userResponse.responsability_level_id] || 'Desconocido';
    const gender = genderMap[userResponse.gender_id] || 'Desconocido';

    // 3. Obtener los datos del usuario
    const user = await User.findOne({
      where: { id: user_id },
      attributes: ['username', 'email']
    });

    if (!user) {
      return res.status(404).json({ error: 'No se encontraron los datos del usuario.' });
    }

    // 4. Transformar el map de preguntas
    const preguntasResueltas = Object.keys(data).map((pregunta, index) => {
      const respuesta = respuestaMap[data[pregunta]];
      return {
        pregunta: preguntasDefiniciones[pregunta],
        respuesta: respuesta || "No especificado"
      };
    });

    // 5. Generar técnicas de estrés personalizadas
    const techniquesResponse = await generadorEstresTecnicas(req, res);
    if (!techniquesResponse || techniquesResponse.error) {
      return res.status(500).json({ error: 'Error al generar técnicas de estrés.' });
    }

    // 6. Obtener todas las técnicas generadas
    const tecnicasGeneradas = techniquesResponse.data;

    // 7. Definir tecnicasFormatted
    const tecnicasFormatted = tecnicasGeneradas.map(tecnica => ({
      id: tecnica.id,
      nombre: tecnica.nombre,
      tipotecnicas_id: tecnica.tipotecnicas_id
    }));

    // 8. Generar el reporte usando la integración con GPT
    const prompt = `
    Basado en los detalles del usuario y las técnicas proporcionadas, genera un plan de 21 días con las siguientes condiciones:
    - Selecciona 7 técnicas de tipo 1 (Técnicas de Relajación), 7 de tipo 2 (Reestructuración Cognitiva) y 7 de tipo 3 (Técnicas de PNL) pero tienes que varias, osea de todas las opciones que tienes en cada tipo debes elegir la que mas le convenga al usuario por favor no me des siempre las mismas respuestas.
    Datos del usuario:
    - Nivel de estrés: ${estres_nivel_id}
    - Rango de edad: ${age_range}
    - Nivel jerárquico: ${hierarchical_level}
    - Nivel de responsabilidad: ${responsability_level}
    - Género: ${gender}
    - Respuestas a las preguntas:
    ${preguntasResueltas.map((p, index) => `Pregunta ${index + 1}: ${p.pregunta} - Respuesta: ${p.respuesta}`).join('\n')}
    - Aquí están todas las técnicas disponibles para seleccionar (Tipo 1 = Técnica de Relajación, Tipo 2 = Reestructuración Cognitiva, Tipo 3 = Técnica de PNL):
    ${tecnicasFormatted.map(t => `ID: ${t.id}, Nombre: ${t.nombre}, Tipo: ${t.tipotecnicas_id}`).join('\n')}

    Una vez que tengas el plan para este usuario tu respuesta a este prompt solo sera el plan en este formato Json sin nada adicional solo un Json con el formato que te mostrare a continuación (Recuerda elegir las 7 tecnicas de cada tipo que mas le convengan a el usuario segun los datos proporcionados, los 7 primeros dias solo puedes elegir las tecnicas que mas les convegan al usuario pero tipo 1, las segunda semana las que mas que convengan al usuario pero tipo 2 y la tercera y ultima semana solo tecnicas de tipo 3 tambien las que mas le convengan al usuario. Recuerda que tendremos muchos usuario por lo tanto cada un tendra problemas diferentes de como se debe tratar por eso de estoy dando todos los datos del usuario:
    (Por otro lado debo dejarte claro que debes elegir lo mejor para el usuario, no ve vas a pasar siempre por ejemplo numero conescutico de id de las tecnicas es no me sirve debes variar y darme lo mejor para el usuario en el orden conveniete que debe llevar las tecnicas que selecciones)
    {
      Id : (num de la tecnica, tipo int),
      Dia: (el dia que se realizara esta tecnica de los 21 dias, tipo int),
    },
    asi sucesivamente hasta completar los 21 dias ...
  `;

    const gptResponse = await getBotResponse(prompt, user_id);
    console.log('Respuesta completa de GPT:', gptResponse);

    // 9. Extraer el JSON de la respuesta de GPT
    let programaUsuario;
    try {
      const jsonStartIndex = gptResponse.indexOf('[');
      const jsonEndIndex = gptResponse.lastIndexOf(']') + 1;

      if (jsonStartIndex !== -1 && jsonEndIndex !== -1) {
        const jsonString = gptResponse.slice(jsonStartIndex, jsonEndIndex);
        programaUsuario = JSON.parse(jsonString);
      } else {
        throw new Error("No se encontró un bloque JSON válido en la respuesta de GPT.");
      }
    } catch (error) {
      console.error('Error al parsear la respuesta de GPT:', error);
      return res.status(500).json({ error: 'Error al procesar la respuesta de GPT.' });
    }

    const startDate = moment.tz('America/Lima').format('YYYY-MM-DD HH:mm:ss');
    const registros = programaUsuario.map(item => ({
      user_id: user_id,
      estrestecnicas_id: item.Id,
      dia: item.Dia,
      start_date: startDate 
    }));

    console.log('Registros a insertar en UserPrograma:', JSON.stringify(registros, null, 2));

    await UserPrograma.bulkCreate(registros);
    console.log('Registros insertados correctamente en la tabla UserPrograma');

    res.status(200).json({
      message: 'Reporte y programa generados correctamente, y registros insertados en UserPrograma.',
      programaUsuario
    });

  } catch (error) {
    console.error('Error al generar el reporte del usuario:', error);
    // Asegurarse de no enviar múltiples respuestas
    if (!res.headersSent) {
      return res.status(500).json({ error: 'Error interno del servidor.' });
    }
  }
};
*/
// Obtener todos los registros de UserPrograma filtrados por user_id junto con los detalles de EstresTecnicas
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
  const { user_id, estrestecnicas_id } = req.params; // Obtener user_id y estrestecnicas_id de los parámetros
  const { comentario, estrellas } = req.body; // Obtener los campos que se quieren actualizar del body

  try {
    // Buscar el registro basado en user_id y estrestecnicas_id
    const userPrograma = await UserPrograma.findOne({
      where: {
        user_id,
        estrestecnicas_id
      }
    });

    if (!userPrograma) {
      return res.status(404).json({ error: 'Programa no encontrado' });
    }

    // Actualizar los campos comentario y estrellas si se pasan en el body
    userPrograma.comentario = comentario || userPrograma.comentario;
    userPrograma.estrellas = estrellas !== undefined ? estrellas : userPrograma.estrellas;

    // Guardar los cambios en la base de datos
    await userPrograma.save();

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
  const { user_id } = req.params;  // Obtener el user_id de los parámetros
  try {
    const userProgramas = await UserPrograma.findAll({
      where: { user_id },  // Filtrar por user_id
      include: [{
        model: EstresTecnicas,  // Incluir la tabla relacionada 'EstresTecnicas'
        as: 'tecnica',  // Alias para acceder a los datos de EstresTecnicas
        attributes: ['id', 'nombre', 'mensaje', 'steps', 'tipo', 'icon']  // Especificar los campos que quieres obtener
      }],
      order: [['dia', 'ASC']]  // Ordenar por el campo 'dia' de forma ascendente
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