const { Empresa } = require('../models');
async function createEmpresa(req, res){
    const { nombre, ruc } = req.body;

    try {
        // Validaciones básicas
        if (!nombre || !ruc) {
          return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }
        if (typeof(nombre) !== "string" || typeof(ruc) !== "string"){
          return res.status(400).json({ error: 'Los campos "nombre" y "ruc" solo aceptan texto' });

        }
        const empresa = await Empresa.create({
            nombre,
            ruc,
            fecha_creacion: new Date(),
          });
      
          res.status(201).json({ message: 'Empresa creada correctamente.', data: empresa });
        } catch (error) {
          console.error('Error al crear el empresa:', error);
          res.status(500).json({ error: 'Error interno del servidor.' });
        }
}

module.exports = {
    createEmpresa
};