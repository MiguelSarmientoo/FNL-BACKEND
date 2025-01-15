const axios = require("axios");
require("dotenv").config();
const UserPrograma = require("../models/userprograma");

const { Message, User } = require("../models");
const { Op } = require("sequelize");

const countTokens = (text) => {
  return text.split(" ").length; // Estimación simple, no exacta
};

const generatePrograms = async (
  user_id,
  username,
  age_range,
  hierarchical_level,
  responsability_level,
  gender,
  estres_nivel,
  resumenRespuestas
) => {
  const apiKey = process.env.OPENAI_API_KEY;
  const url = "https://api.openai.com/v1/chat/completions";

  // Dividir prompts en tres partes
  const prompts = [
    {
      seccion: "Días 1-3",
      tipo: "Técnicas de relajación",
      prompt: `
        Genera un programa personalizado para los días 1 a 3 (Técnicas de Relajación).
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
  
        Nota: Solo responde con el JSON válido.
      `,
    },
    {
      seccion: "Días 4-6",
      tipo: "Técnicas de relajación",
      prompt: `
        Genera un programa personalizado para los días 4 a 6 (Técnicas de relajación).
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
  
        Nota: Solo responde con el JSON válido.
      `,
    },
    {
      seccion: "Días 7-9",
      tipo: "Reestructuación Cognitiva",
      prompt: `
        Genera un programa personalizado para los días 7 a 9 (Técnica de Reestructuación Cognitiva).
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

        Nota: Solo responde con el JSON válido.
      `,
    },
    {
      seccion: "Días 10-12",
      tipo: "Reestructuación Cognitiva",
      prompt: `
          Genera un programa personalizado para los días 10 a 12 (Técnica de Reestructuación Cognitiva).
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
  
          Nota: Solo responde con el JSON válido.
        `,
    },
    {
      seccion: "Días 13-15",
      tipo: "Reestructuación Cognitiva",
      prompt: `
          Genera un programa personalizado para los días 13 a 15 (Técnica de Reestructuación Cognitiva).
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
  
          Nota: Solo responde con el JSON válido.
        `,
    },
    {
      seccion: "Días 16-18",
      tipo: "Técnicas de PNL",
      prompt: `
          Genera un programa personalizado para los días 16 a 18 (Técnicas de PNL).
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
  
          Nota: Solo responde con el JSON válido.
        `,
    },
    {
      seccion: "Días 19-21",
      tipo: "Técnicas de PNL",
      prompt: `
          Genera un programa personalizado para los días 19 a 21 (Técnicas de PNL).
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
  
          Nota: Solo responde con el JSON válido.
        `,
    },
  ];

  const programas = [];
  for (const { seccion, prompt } of prompts) {
    let structuredPrompt = {
      role: "user",
      content: prompt,
    };

    let systemContext = {
      role: "system",
      content: `
      Para cada solicitud deberás tener encuenta la siguiente información, te servirá:
      
      Datos del usuario:
        - Nombre: ${username}
        - Edad: ${age_range}
        - Nivel jerárquico: ${hierarchical_level}
        - Nivel de responsabilidad: ${responsability_level}
        - Género: ${gender}
        - Nivel de estrés: ${estres_nivel}
  
        Respuestas al test de estrés:
        ${resumenRespuestas}
      
      `,
    };

    let gptResponse = await axios.post(
      url,
      {
        model: "gpt-4",
        messages: [systemContext, structuredPrompt],
        temperature: 0.2, // Respuestas más coherentes y precisas
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );
    gptResponse = gptResponse.data.choices[0].message.content.trim();
    console.debug(`Respuesta de GPT para ${seccion}:`, gptResponse);
    // Validar y parsear JSON
    try {
      //Intentaremos subir la data tan pronto la tengamos lista.
      // programas.push(...JSON.parse(gptResponse));

      let resultGroup = JSON.parse(gptResponse);

      const registros = resultGroup.map((item) => ({
        user_id: user_id,
        dia: item.día,
        nombre_tecnica: item.nombre_técnica,
        tipo_tecnica: item.tipo_técnica,
        descripcion: item.descripción,
        guia: JSON.stringify(item.guía),
        start_date: item.día === 1 ? new Date() : null,
        completed_date: null,
        comentario: item.comentario || null,
        estrellas: item.estrellas || 3,
      }));

      // Insertar registros en la base de datos
      await UserPrograma.bulkCreate(registros);
    } catch (error) {
      console.error(`Error al parsear JSON para ${seccion}:`, error);
    }
  }
};

const analyzeMessage = async (mensaje) => {
  const apiKey = process.env.OPENAI_API_KEY;
  const url = "https://api.openai.com/v1/chat/completions";

  const systemMessage = {
    role: "system",
    content: `
  Analiza el siguiente mensaje, de parte de los usuarios de nuestra app para ayuda psicológica en el trabajo:
  Responde en formato JSON estrictamente válido:
    {
      "sentimiento": "Positivo" (El mensaje tiene un tono optimista o alegre) o "Negativo" (El mensaje tiene un tono triste, enojado o preocupado) o "Neutral"(El mensaje no refleja emociones claras),
      "factor_psicosocial": "Relación interpersonal" (e.g., problemas con jefe o compañeros) o "Estrés laboral" (e.g., carga laboral, falta de tiempo) o "Salud emocional" (e.g., sentirse triste, desmotivado) o "Ninguno" (si el mensaje no menciona ningún factor específico),
    }
  `,
  };

  const message = {
    role: "user",
    content: mensaje,
  };

  try {
    const response = await axios.post(
      url,
      {
        model: "gpt-4",
        messages: [systemMessage, message],
        temperature: 0.2, // Respuestas más coherentes y precisas
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    rpta = JSON.parse(response.data.choices[0].message.content.trim());

    switch (rpta["sentimiento"]) {
      case "Negativo":
        rpta["score"] = -1;
        break;
      case "Positivo":
        rpta["score"] = 1;
        break;
      default: //Neutral
        rpta["score"] = 0;
        break;
    }

    rpta["message_length"] = mensaje.length;

    return rpta;
  } catch (error) {
    console.error(
      "Error al obtener respuesta del bot:",
      error.response?.data || error.message
    );
    throw new Error(
      `Error al obtener respuesta del bot: ${
        error.response?.data?.error?.message || error.message
      }`
    );
  }
};

const getBotResponse = async (prompt, userId) => {
  const apiKey = process.env.OPENAI_API_KEY;
  const url = "https://api.openai.com/v1/chat/completions";
  const MAX_TOKENS = 100; // Máximo de tokens para la respuesta

  if (!prompt || typeof prompt !== "string") {
    throw new Error("Invalid prompt");
  }

  try {
    // Obtener el usuario por userId para obtener el username
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    const username = user.username; // Obtiene el username

    // Obtener historial de mensajes del usuario
    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { user_id: userId, user_id_receptor: 1 },
          { user_id: 1, user_id_receptor: userId },
        ],
      },
      order: [["created_at", "ASC"]],
    });

    // Imprimir los mensajes obtenidos
    console.log("Mensajes obtenidos:", messages);

    // Convertir historial de mensajes a formato adecuado para OpenAI
    const chatHistory = messages.map((msg) => ({
      role: msg.user_id === userId ? "user" : "assistant",
      content: msg.content,
    }));

    // Imprimir el historial de chat
    console.log("Historial de chat formateado:", chatHistory);

    // Agregar el prompt actual al historial
    chatHistory.push({ role: "user", content: prompt });

    // Configurar el mensaje del sistema
    const systemMessage = {
      role: "system",
      content: `
        Tu nombre es Funcy, un asistente de IA especializado en apoyo psicológico y bienestar emocional. Tu propósito es ofrecer orientación comprensiva y práctica a ${username}, quien puede estar enfrentando estrés laboral o emocional. 
    
        **Instrucciones Clave**:
    
        1. **Escucha Activa**: Comienza cada interacción validando las emociones y experiencias de ${username}. Usa frases como "Entiendo que esto puede ser difícil para ti".
    
        2. **Diagnóstico Situacional**: Pregunta de manera clara y específica sobre la situación actual del usuario. Usa preguntas abiertas para comprender su contexto y preocupaciones: 
           - "¿Qué aspectos de tu trabajo te están causando más estrés en este momento?"
           - "¿Puedes compartir más sobre lo que te está preocupando?"
    
        3. **Técnicas Psicológicas Avanzadas**: Ofrece técnicas basadas en evidencia, como:
           - **Reestructuración Cognitiva**: Ayuda a identificar y desafiar pensamientos negativos. Ejemplo: "¿Has considerado cómo tus pensamientos pueden estar influyendo en tu estrés? Vamos a explorar eso juntos".
           - **Técnicas de Regulación Emocional**: Propón métodos como la identificación de emociones y su regulación. Ejemplo: "Reconocer tus emociones es el primer paso para gestionarlas. ¿Qué emociones estás sintiendo ahora mismo?"
    
        4. **Acciones Concretas**: Brinda recomendaciones claras y específicas que el usuario pueda implementar. Por ejemplo:
           - "Dedica unos minutos a escribir tus pensamientos sobre la situación. Esto puede ayudarte a clarificar tus sentimientos".
           - "Considera establecer límites claros en el trabajo. ¿Cómo podrías hacerlo en tu caso?"
    
        5. **Fomento de la Resiliencia**: Ofrece estrategias para desarrollar habilidades de afrontamiento. Por ejemplo:
           - "Practicar el autocuidado regular es vital. ¿Qué actividades disfrutas que podrían ayudarte a relajarte y recuperar energías?"
    
        6. **Seguimiento y Apoyo Continuo**: Cierra cada sesión con un recordatorio de que estás ahí para apoyarlo. Por ejemplo:
           - "Recuerda que puedes volver aquí siempre que necesites hablar. Estoy aquí para ayudarte en este proceso."
    
        Evita sugerencias superficiales o generales. Cada respuesta debe ser rica en contenido, relevante y orientada a la acción, asegurando que ${username} sienta que está recibiendo apoyo práctico y emocional de calidad.
        Importante, si el mensaje del usuario no está relacionado con tus facultados (ayuda psicológica) entonces deberás responder que no estás habilitado para responder mensajes que no estén relacionados al apoyo psicológico y bienestar emocional.
      `,
    };

    // Limitar el historial a solo los mensajes más recientes para que no supere el límite de tokens
    let totalTokens = countTokens(systemMessage.content) + MAX_TOKENS;
    const limitedChatHistory = [];

    for (let i = chatHistory.length - 1; i >= 0; i--) {
      const messageTokens = countTokens(chatHistory[i].content);
      if (totalTokens + messageTokens <= 4096) {
        // Asegúrate de que no supere el límite
        limitedChatHistory.unshift(chatHistory[i]);
        totalTokens += messageTokens;
      } else {
        break; // Detén la iteración si se excede el límite
      }
    }

    // Mensaje de éxito para la lectura del historial
    console.log("Historial leído correctamente:", limitedChatHistory);

    // Enviar todo el historial limitado y el mensaje del sistema en una sola solicitud
    const response = await axios.post(
      url,
      {
        model: "gpt-4",
        messages: [systemMessage, ...limitedChatHistory],
        //max_tokens: 2500,  // Permitir respuestas más largas
        temperature: 0.2, // Respuestas más coherentes y precisas
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error(
      "Error al obtener respuesta del bot:",
      error.response?.data || error.message
    );
    throw new Error(
      `Error al obtener respuesta del bot: ${
        error.response?.data?.error?.message || error.message
      }`
    );
  }
};

module.exports = { getBotResponse, analyzeMessage, generatePrograms };
