const express = require('express');
const router = express.Router();
const Usuario = require('../Model/Usuarios');
const bcrypt = require('bcryptjs');

// Registro
router.post('/Registro.js', (req, res) => {
    const { nombre, apellido, correo, contrasena, confirmarContrasena } = req.body;

    if (contrasena !== confirmarContrasena) {
        return res.status(400).send('Las contraseñas no coinciden');
    }

    Usuario.buscarPorCorreo(correo, (err, results) => {
        if (err) return res.status(500).send(err);
        if (results.length > 0) return res.status(400).send('Correo ya registrado');

        Usuario.registrar(nombre, apellido, correo, contrasena, (err, results) => {
            if (err) return res.status(500).send(err);
            res.send('Usuario registrado con éxito');
        });
    });
});

module.exports = router;
