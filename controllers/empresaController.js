const Empresa = require("../models/empresa");
const sequelize = require('../config/database');

// Obtener todas las empresas
const getEmpresas = async (req, res) => {
    try {
        const empresas = await Empresa.findAll();
        res.status(200).json(empresas);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener una empresa por ID
const getEmpresaById = async (req, res) => {
    try {
        const empresa = await Empresa.findByPk(req.params.id);
        if (!empresa) return res.status(404).json({ message: 'Empresa no encontrada' });
        res.status(200).json(empresa);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Crear una nueva empresa
const createEmpresa = async (req, res) => {
    const empresa = new Empresa(req.body);
    try {
        const nuevaEmpresa = await empresa.save();
        res.status(201).json(nuevaEmpresa);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Actualizar una empresa existente
const updateEmpresa = async (req, res) => {
    try {
        const empresa = await Empresa.findByPk(req.params.id);
        if (!empresa) return res.status(404).json({ message: 'Empresa no encontrada' });
        await empresa.update(req.body);
        res.status(200).json(empresa);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Eliminar una empresa
const deleteEmpresa = async (req, res) => {
    try {
        const empresa = await Empresa.findByPk(req.params.id);
        if (!empresa) return res.status(404).json({ message: 'Empresa no encontrada' });
        await empresa.destroy();
        res.status(200).json({ message: 'Empresa eliminada' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getEmpresas,
    getEmpresaById,
    createEmpresa,
    updateEmpresa,
    deleteEmpresa
};
