const TipoTecnicas = require('../models/tipotecnicas');

// Obtener todas las categorías de técnicas
exports.getAll = async (req, res) => {
  try {
    const tipoTecnicas = await TipoTecnicas.findAll();
    res.status(200).json(tipoTecnicas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las categorías de técnicas' });
  }
};

// Obtener una categoría de técnica por ID
exports.getById = async (req, res) => {
  const { id } = req.params;
  try {
    const tipoTecnica = await TipoTecnicas.findByPk(id);
    if (!tipoTecnica) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }
    res.status(200).json(tipoTecnica);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la categoría de técnica' });
  }
};

// Crear una nueva categoría de técnica
exports.create = async (req, res) => {
  const { nombre } = req.body;
  try {
    const newTipoTecnica = await TipoTecnicas.create({
      nombre
    });
    res.status(201).json(newTipoTecnica);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la categoría de técnica' });
  }
};

// Actualizar una categoría de técnica por ID
exports.update = async (req, res) => {
  const { id } = req.params;
  const { nombre } = req.body;
  try {
    const tipoTecnica = await TipoTecnicas.findByPk(id);
    if (!tipoTecnica) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }

    tipoTecnica.nombre = nombre || tipoTecnica.nombre;

    await tipoTecnica.save();
    res.status(200).json(tipoTecnica);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la categoría de técnica' });
  }
};

// Eliminar una categoría de técnica por ID
exports.delete = async (req, res) => {
  const { id } = req.params;
  try {
    const tipoTecnica = await TipoTecnicas.findByPk(id);
    if (!tipoTecnica) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }

    await tipoTecnica.destroy();
    res.status(204).json({ message: 'Categoría eliminada con éxito' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la categoría de técnica' });
  }
};
