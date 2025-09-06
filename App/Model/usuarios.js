const conexion = require('../Db/Conexion');
const bcrypt = require('bcryptjs');

const Usuario = {
    registrar: async (nombre, apellido, correo, contrasena, callback) => {
        const hash = await bcrypt.hash(contrasena, 10); // Encripta la contraseña
        conexion.query(
            `INSERT INTO usuarios (nombre, apellido, correo, contrasena)
             VALUES (?, ?, ?, ?)`,
            [nombre, apellido, correo, hash],
            callback
        );
    },

    buscarPorCorreo: (correo, callback) => {
        conexion.query(
            'SELECT * FROM usuarios WHERE correo = ?',
            [correo],
            callback
        );
    }
};

module.exports = Usuario;
