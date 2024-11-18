const multer = require('multer');
const path = require('path');

// Configuración de multer para almacenar las imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Directorio donde se almacenarán las imágenes
    cb(null, path.join(__dirname, '../imagenes')); // Ajusta el path según tu estructura
  },
  filename: (req, file, cb) => {
    // Crear un nombre único para cada imagen
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Mantener la extensión original
  },
});

// Crear un middleware de multer para manejar el archivo
const upload = multer({ storage: storage }).single('profileImage'); // 'profileImage' es el nombre del campo en el formulario

module.exports = upload;
