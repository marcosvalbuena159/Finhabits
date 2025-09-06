const express = require('express');
const router = express.Router();
const Usuario = require('../Model/Usuarios');
const bcrypt = require('bcryptjs');

// Login
router.post('/login', async (req, res) => {
    const { correo, contrasena } = req.body;
});

module.exports = router;
