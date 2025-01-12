const { Empresa } = require("../models");

async function createEmpresa(req, res) {
  const { nombre, ruc } = req.body;

  try {
    // Validaciones básicas
    if (!nombre || !ruc) {
      return res
        .status(400)
        .json({ error: "Todos los campos son obligatorios" });
    }
    if (typeof nombre !== "string" || typeof ruc !== "string") {
      return res
        .status(400)
        .json({ error: 'Los campos "nombre" y "ruc" solo aceptan texto' });
    }
    const empresa = await Empresa.create({
      nombre,
      ruc,
      fecha_creacion: new Date(),
    });

    res
      .status(201)
      .json({ message: "Empresa creada correctamente.", data: empresa });
  } catch (error) {
    console.error("Error al crear la empresa:", error);
    res.status(500).json({ error: "Error interno del servidor." });
  }
}

async function obtenerEmpresa(req, res) {
  const id = req.params.id;
  try {
    // Validaciones básicas
    if (!id) {
      return res
        .status(400)
        .json({ error: 'Debes proporcionar el "id" de la empresa.' });
    }
    if (Number.isNaN(Number(id))) {
      return res.status(400).json({ error: "El 'id' debe ser un número" });
    }
    const empresa = await Empresa.findByPk(id);

    if (empresa != null) {
      return res.status(200).json(empresa);
    }

    return res
      .status(404)
      .json({ error: "No existe empresa registrada con ese id" });
  } catch (error) {
    console.error("Error al obtener la empresa:", error);
    return res.status(500).json({ error: "Error interno del servidor." });
  }
}

module.exports = {
  createEmpresa,
  obtenerEmpresa,
};
