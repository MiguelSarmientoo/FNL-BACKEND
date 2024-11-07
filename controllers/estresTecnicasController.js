const axios = require('axios'); // Importación de axios
const { EstresTecnicas, User } = require('../models'); // Modelos necesarios
require('dotenv').config();

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

    const messages = [
      {
        role: 'system',
        content: `Eres un asistente de IA especializado en generar técnicas personalizadas para reducir el estrés. Por favor, genera una lista de 21 técnicas únicas para ${stressType}. Cada técnica debe tener un formato JSON, con claves 'nombre', 'message' y 'steps', donde 'steps' es una lista de objetos que contienen 'message'. La respuesta dámelo todo en JSON.`
      },
      {
        role: 'user',
        content: `Por favor, genera 21 técnicas de manejo del estrés para el tipo de estrés: ${stressType}.`
      }
    ];

    const response = await axios.post(
      url,
      {
        model: 'gpt-4',
        messages,
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

    if (!response.data || !response.data.choices || response.data.choices.length === 0) {
      return res.status(500).json({ error: 'No se recibió una respuesta válida de OpenAI' });
    }

    const responseContent = response.data.choices[0].message.content;
    let techniques;
    try {
      techniques = JSON.parse(responseContent);
    } catch (error) {
      return res.status(500).json({ error: 'Error al parsear la respuesta JSON de OpenAI', details: error.message });
    }

    if (!Array.isArray(techniques) || techniques.length !== 21) {
      return res.status(400).json({ error: `Se generaron ${techniques.length || 0} técnicas. Se esperaban 21. Por favor intenta nuevamente.` });
    }

    const tipoTecnicasMapping = {
      'respiración': 1,
      'meditación': 2,
      'cognitiva': 3,
    };

    const asignarTipoTecnica = (contenido) => {
      for (const key in tipoTecnicasMapping) {
        if (contenido.includes(key)) return tipoTecnicasMapping[key];
      }
      return 1; // Valor predeterminado
    };

    const extraerPasos = (steps) => {
      return Array.isArray(steps) ? steps.map(step => ({ message: step.message.trim() })) : [];
    };

    const estresTecnicas = await Promise.all(
      techniques.map(async (tecnica, index) => {
        if (!tecnica || !tecnica.message) return null; // Validación básica

        const pasos = extraerPasos(tecnica.steps);
        try {
          return await EstresTecnicas.create({
            nombre: tecnica.nombre,
            mensaje: tecnica.message,
            steps: pasos,
            tipo: stressType,
            user_id: userId,
            tipotecnicas_id: asignarTipoTecnica(tecnica.message)
          });
        } catch (dbError) {
          console.error(`Error al guardar la técnica en el índice ${index}:`, dbError);
          return null;
        }
      })
    );

    const tecnicasGuardadas = estresTecnicas.filter(tecnica => tecnica !== null);
    res.status(201).json(tecnicasGuardadas);

  } catch (error) {
    console.error('Error al generar y guardar técnicas de estrés:', error);
    res.status(500).json({ error: 'Error al generar técnicas de estrés', details: error.message });
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
