const axios = require('axios'); // Importación de axios
const { EstresTecnicas, User } = require('../models'); // Modelos necesarios
require('dotenv').config();

// Generar técnicas de estrés utilizando la API de OpenAI
/*exports.generadorEstresTecnicas = async (req, res) => {
  const apiKey = process.env.OPENAI_API_KEY;
  const userId = req.params.userId;
  const stressType = req.body.stressType;
  const url = 'https://api.openai.com/v1/chat/completions';

  if (!apiKey) {
    return res.status(500).json({ error: 'API key de OpenAI no configurada' });
  }

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Mensajes para la solicitud a OpenAI
    const messages = [
      {
        role: 'system',
        content: `Eres un asistente de IA especializado en generar técnicas personalizadas para reducir el estrés. Basado en el tipo de estrés proporcionado por el usuario, genera una lista de 21 técnicas únicas, una para cada día, que sean prácticas y aplicables para ${stressType}, enfocadas en mejorar el bienestar mental del usuario.`
      },
      {
        role: 'user',
        content: `Por favor, genera una lista de 21 técnicas únicas de manejo del estrés para el tipo de estrés: ${stressType}. Cada técnica debe ser clara y aplicable para cada uno de los 21 días. Asegúrate de que cada técnica sea diferente y que se adapte a las necesidades de un usuario que enfrenta este tipo de estrés.`
      }
    ];

    // Llamada a la API de OpenAI
    const response = await axios.post(
      url,
      {
        model: 'gpt-4',
        messages: messages,
        max_tokens: 1500,
        temperature: 0.7
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        }
      }
    );

    // Validar respuesta de OpenAI
    if (!response.data || !response.data.choices || response.data.choices.length === 0) {
      return res.status(500).json({ error: 'No se recibió una respuesta válida de OpenAI' });
    }

    // Extraer las técnicas generadas
    const techniques = response.data.choices[0].message.content.split('\n').filter(line => line.trim() !== '');

    // Validar que se generen exactamente 21 técnicas
    if (techniques.length < 21) {
      return res.status(400).json({ error: 'Se generaron menos de 21 técnicas. Por favor intenta nuevamente.' });
    }

    // Función para definir tipotecnicas_id de forma dinámica
    const asignarTipoTecnica = (contenido) => {
      if (contenido.toLowerCase().includes('relajación')) return 1; // Técnica de Relajación
      if (contenido.toLowerCase().includes('cognitiva')) return 2;  // Reestructuración Cognitiva
      if (contenido.toLowerCase().includes('pnl')) return 3;        // Técnica de PNL
      return 1; // Valor predeterminado si no se encuentra un tipo específico
    };

    // Guardar las técnicas generadas en la base de datos
    const estresTecnicas = await Promise.all(
      techniques.slice(0, 21).map(async (technique, index) => {
        const tipoTecnica = asignarTipoTecnica(technique);
        if (!tipoTecnica) {
          console.error(`Error al asignar tipotecnicas_id para la técnica: ${technique}`);
        }
        return await EstresTecnicas.create({
          nombre: `Técnica día ${index + 1}`,
          mensaje: technique,
          tipo: stressType,
          user_id: userId,
          tipotecnicas_id: tipoTecnica || 1 // Asigna valor predeterminado si es null o undefined
        });
      })
    );

    // Filtrar las técnicas nulas (si alguna fue omitida)
    const tecnicasGuardadas = estresTecnicas.filter(tecnica => tecnica !== null);
    return res.status(201).json(tecnicasGuardadas);

  } catch (error) {
    console.error('Error al generar y guardar técnicas de estrés:', error.message);
    if (!res.headersSent) {
      return res.status(500).json({ error: 'Error al generar técnicas de estrés' });
    }
  }
};
*/
exports.generadorEstresTecnicas = async (req, res) => {
  const apiKey = process.env.OPENAI_API_KEY;
  const userId = req.params.userId;
  const stressType = req.body.stressType;
  const url = 'https://api.openai.com/v1/chat/completions';

  if (!apiKey) {
    return res.status(500).json({ error: 'API key de OpenAI no configurada' });
  }
  
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Mensajes para la solicitud a OpenAI
    const messages = [
      {
        role: 'system',
        content: `Eres un asistente de IA especializado en generar técnicas personalizadas para reducir el estrés. Por favor, genera una lista de 21 técnicas únicas para ${stressType}. Cada técnica debe tener un formato JSON, con claves 'nombre', 'message' y 'steps', donde 'steps' es una lista de objetos que contienen 'message'. La respuesta damelo todo en json`
      },
      {
        role: 'user',
        content: `Por favor, genera 21 técnicas de manejo del estrés para el tipo de estrés: ${stressType}.`
      }
    ];

    // Llamada a la API de OpenAI
    const response = await axios.post(
      url,
      {
        model: 'gpt-4',
        messages: messages,
        max_tokens: 4000,
        temperature: 0.7
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        }
      }
    );

    console.log('Respuesta de OpenAI:', response.data.choices[0].message.content);

    // Validar respuesta de OpenAI
    if (!response.data || !response.data.choices || response.data.choices.length === 0) {
      return res.status(500).json({ error: 'No se recibió una respuesta válida de OpenAI' });
    }

    const responseContent = response.data.choices[0].message.content;

    // Aquí es donde podrías imprimir la respuesta para depurar
    console.log('Contenido de la respuesta:', responseContent);

    let techniques;
    try {
      techniques = JSON.parse(responseContent);
    } catch (error) {
      return res.status(500).json({ error: 'Error al parsear la respuesta JSON de OpenAI', details: error.message });
    }

    // Validar que se generen exactamente 21 técnicas
    if (!Array.isArray(techniques) || techniques.length !== 21) {
      return res.status(400).json({ error: `Se generaron ${techniques.length || 0} técnicas. Se esperaban 21. Por favor intenta nuevamente.` });
    }

    // Mapeo de tipos de técnicas
    const tipoTecnicasMapping = {
      'respiración': 1,
      'meditación': 2,
      'cognitiva': 3,
    };

    // Función para definir tipotecnicas_id de forma dinámica
    const asignarTipoTecnica = (contenido) => {
      for (const key in tipoTecnicasMapping) {
        if (contenido.includes(key)) return tipoTecnicasMapping[key];
      }
      return 1; // Valor predeterminado si no se encuentra un tipo específico
    };

    // Función para extraer pasos e imágenes de la técnica
    const extraerPasos = (steps) => {
      if (!steps || !Array.isArray(steps)) {
        return [];
      }
      return steps.map(step => ({
        message: step.message ? step.message.trim() : '',
      }));
    };

    const estresTecnicas = await Promise.all(
      techniques.map(async (tecnica, index) => {
        if (!tecnica || !tecnica.message) {
          console.error(`Técnica inválida en el índice ${index}:`, tecnica);
          return null; // Retorna null si la técnica es inválida
        }

        const pasos = extraerPasos(tecnica.steps);
        try {
          return await EstresTecnicas.create({
            nombre: tecnica.nombre,
            mensaje: tecnica.message,
            steps: tecnica.steps,
            tipo: stressType,
            user_id: userId,
            tipotecnicas_id: asignarTipoTecnica(tecnica.message)
          });
        } catch (dbError) {
          console.error(`Error al guardar la técnica en el índice ${index}:`, dbError);
          return null; // Retorna null si no se pudo guardar
        }
      })
    );

    const tecnicasGuardadas = estresTecnicas.filter(tecnica => tecnica !== null);
    res.status(201).json(tecnicasGuardadas);

  } catch (error) {
    console.error('Error al generar y guardar técnicas de estrés:', error);
    return res.status(500).json({ error: 'Error al generar técnicas de estrés', details: error.message });
  }
};

// Obtener todas las técnicas de estrés
exports.getAll = async (req, res) => {
  try {
    const tecnicas = await EstresTecnicas.findAll();
    res.status(200).json(tecnicas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las técnicas de estrés' });
  }
};

// Obtener una técnica de estrés por ID
exports.getById = async (req, res) => {
  const { id } = req.params;
  try {
    const tecnica = await EstresTecnicas.findByPk(id);
    if (!tecnica) {
      return res.status(404).json({ error: 'Técnica no encontrada' });
    }
    res.status(200).json(tecnica);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la técnica de estrés' });
  }
};

// Crear una nueva técnica de estrés
exports.create = async (req, res) => {
  const { nombre, mensaje, steps, tipo, icon, tipotecnicas_id } = req.body;
  if (!nombre || !mensaje || !tipo || !tipotecnicas_id) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }
  try {
    const newTecnica = await EstresTecnicas.create({
      nombre,
      mensaje,
      steps,
      tipo,
      icon,
      tipotecnicas_id
    });
    res.status(201).json(newTecnica);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la técnica de estrés' });
  }
};

// Actualizar una técnica de estrés por ID
exports.update = async (req, res) => {
  const { id } = req.params;
  const { nombre, mensaje, steps, tipo, icon, tipotecnicas_id } = req.body;
  try {
    const tecnica = await EstresTecnicas.findByPk(id);
    if (!tecnica) {
      return res.status(404).json({ error: 'Técnica no encontrada' });
    }

    tecnica.nombre = nombre || tecnica.nombre;
    tecnica.mensaje = mensaje || tecnica.mensaje;
    tecnica.steps = steps || tecnica.steps;
    tecnica.tipo = tipo || tecnica.tipo;
    tecnica.icon = icon || tecnica.icon;
    tecnica.tipotecnicas_id = tipotecnicas_id || tecnica.tipotecnicas_id;

    await tecnica.save();
    res.status(200).json(tecnica);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la técnica de estrés' });
  }
};

// Eliminar una técnica de estrés por ID
exports.delete = async (req, res) => {
  const { id } = req.params;
  try {
    const tecnica = await EstresTecnicas.findByPk(id);
    if (!tecnica) {
      return res.status(404).json({ error: 'Técnica no encontrada' });
    }

    await tecnica.destroy();
    res.status(204).json({ message: 'Técnica eliminada con éxito' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la técnica de estrés' });
  }
};