const sequelize = require('sequelize'); // Asegúrate de importar Sequelize
const UserEstresSession = require('../models/userestressession');

// Función para obtener el estres_nivel_id por user_id
const getEstresNivelByUserId = async (req, res) => {
    try {
        const userId = req.params.user_id; // Obtener el user_id de los parámetros de la ruta
        const session = await UserEstresSession.findOne({
            where: { user_id: userId }, // Buscar la sesión por user_id
            attributes: ['estres_nivel_id'], // Solo devolver el estres_nivel_id
        });

        if (!session) {
            // Si no se encuentra la sesión
            return res.status(404).json({ message: 'Sesión no encontrada para este usuario' });
        }

        // Si se encuentra, devolver el estres_nivel_id
        res.status(200).json({ estres_nivel_id: session.estres_nivel_id });
    } catch (error) {
        // Manejo de errores
        console.error('Error al obtener el nivel de estrés por user_id:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

// Función para asignar o actualizar un nivel de estrés
const assignEstresNivel = async (req, res) => {
    const { user_id, estres_nivel_id } = req.body;

    try {
        // Busca si ya existe una sesión de estrés para el usuario
        const existingSession = await UserEstresSession.findOne({ where: { user_id } });

        if (existingSession) {
            // Si la sesión ya existe, actualiza el estres_nivel_id
            existingSession.estres_nivel_id = estres_nivel_id;
            await existingSession.save();
            return res.status(200).json({ message: 'Nivel de estrés actualizado correctamente.' });
        } else {
            // Si no existe, crea una nueva sesión
            const newSession = await UserEstresSession.create({ user_id, estres_nivel_id });
            return res.status(200).json({ message: 'Nivel de estrés asignado correctamente.', data: newSession });
        }
    } catch (error) {
        console.error('Error al asignar el nivel de estrés:', error);
        res.status(500).json({ message: 'Error del servidor.' });
    }
};

// Nueva función para obtener la distribución global de niveles de estrés con datos descriptivos
const getGlobalStressDistribution = async (req, res) => {
    try {

        const distribution = await UserEstresSession.findAll({
            attributes: [
                'estres_nivel_id',
                [sequelize.fn('COUNT', sequelize.col('estres_nivel_id')), 'total'],
            ],
            group: ['estres_nivel_id'],
            order: [['estres_nivel_id', 'ASC']],
        });

        const totalUsers = distribution.reduce((sum, item) => sum + parseInt(item.dataValues.total), 0);

        const enrichedData = distribution.map(item => {
            const levelId = item.dataValues.estres_nivel_id;
            const total = parseInt(item.dataValues.total);
            const percentage = ((total / totalUsers) * 100).toFixed(2);

            const descriptions = {
                1: { name: 'Bajo', color: '#00c853' },
                2: { name: 'Moderado', color: '#ffeb3b' },
                3: { name: 'Alto', color: '#d50000' },
            };

            return {
                nivel_id: levelId,
                nivel_nombre: descriptions[levelId]?.name || 'Desconocido',
                color: descriptions[levelId]?.color || '#000000',
                total,
                porcentaje: `${percentage}%`,
            };
        });

        res.status(200).json(enrichedData);
    } catch (error) {
        console.error('Error al obtener la distribución global de niveles de estrés:', error);
        res.status(500).json({ message: 'Error del servidor al obtener la distribución global de niveles de estrés.' });
    }
};

module.exports = {
    getEstresNivelByUserId,
    assignEstresNivel,
    getGlobalStressDistribution,
};
