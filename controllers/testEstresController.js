//controllers/testEstresController.js
const TestEstres = require('../models/test_estres');

exports.saveTestEstres = async (req, res) => {
    try {
      console.log(req.body); // Ver qué datos llegan al controlador
      const nuevaRespuesta = await TestEstres.create(req.body);
      res.status(200).json(nuevaRespuesta);
    } catch (error) {
      console.log(error); // Ver el error exacto
      res.status(400).json({ error: 'No se pudo guardar la respuesta del test de estrés.' });
    }
  };

exports.getAllTestEstres = async (req, res) => {
  try {
    const respuestas = await TestEstres.findAll();  
    res.status(200).json(respuestas); 
  } catch (error) {
    res.status(500).json({ error: 'No se pudieron recuperar las respuestas del test de estrés.' });
  }
};
