const express = require('express');
const router = express.Router();

// Modelo de rango de edad
const { AgeRange } = require('../models'); // Asegúrate de que este modelo existe
const { HierarchicalLevel } = require('../models');
const { ResponsabilityLevel } = require('../models');
const { Gender } = require('../models');

// Ruta para obtener el rango de edad
router.get('/range-age', async (req, res) => {
  try {
    const ageRanges = await AgeRange.findAll(); // Consulta la base de datos para obtener los datos
    res.json({ results: ageRanges });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener rango de edades' });
  }
});

// Ruta para obtener los niveles jerárquicos
router.get('/hierarchical-level', async (req, res) => {
    try {
      const levels = await HierarchicalLevel.findAll(); // Consulta a la base de datos
      res.json({ results: levels });
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener niveles jerárquicos' });
    }
  });

  // Ruta para obtener los niveles de responsabilidad
router.get('/responsability-level', async (req, res) => {
    try {
      const levels = await ResponsabilityLevel.findAll(); // Consulta la base de datos para obtener los datos
      res.json({ results: levels });
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener niveles de responsabilidad' });
    }
  });

  // Ruta para obtener los géneros
router.get('/gender', async (req, res) => {
    try {
      const genders = await Gender.findAll(); // Consulta la base de datos para obtener los géneros
      res.json({ results: genders });
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener géneros' });
    }
  });

// Otras rutas relacionadas con "maintance" pueden ir aquí

module.exports = router;
