const express = require('express');
const router = express.Router();
const Usuario = require('../Model/Usuarios');
const bcrypt = require('bcryptjs');

// Registro
router.post('/Registro.js', (req, res) => {
    const { nombre, apellido, correo, contrasena, confirmarContrasena } = req.body;
});

module.exports = router;
