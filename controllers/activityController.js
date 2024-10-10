const connection = require('../config/database');  // Asegúrate de que la ruta sea correcta

// Agregar una actividad
exports.addActivity = (req, res) => {
  const { description, date } = req.body;
  const userId = req.user.id; // User ID from token (asumimos que el token contiene el ID del usuario)
  
  connection.query(
    'INSERT INTO activities (user_id, description, date) VALUES (?, ?, ?)',
    [userId, description, date],
    (error, results) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      res.status(201).json({ message: 'Activity added successfully' });
    }
  );
};

// Obtener las actividades del usuario
exports.getUserActivities = (req, res) => {
  const userId = req.user.id;  // ID del usuario autenticado desde el token
  
  connection.query(
    'SELECT * FROM activities WHERE user_id = ?',
    [userId],
    (error, results) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      res.status(200).json(results);
    }
  );
};
