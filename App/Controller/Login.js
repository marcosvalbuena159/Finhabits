const express = require('express');
const router = express.Router();
const Usuario = require('../Model/Usuarios');
const bcrypt = require('bcryptjs');

// Login
router.post('/login', async (req, res) => {
    const { correo, contrasena } = req.body;

    Usuario.buscarPorCorreo(correo, async (err, results) => {
        if (err) return res.status(500).send(err);
        if (results.length === 0) return res.status(404).send('Usuario no encontrado');

        const usuario = results[0];
        const valido = await bcrypt.compare(contrasena, usuario.contrasena);

        if (!valido) return res.status(401).send('Contraseña incorrecta');

        res.send('Inicio de sesión exitoso');
    });
});

module.exports = router;
