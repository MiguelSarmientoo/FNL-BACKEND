const EstresTecnicas = require('../models/estrestecnicas');

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
