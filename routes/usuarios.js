const express = require("express");
const router = express.Router();
const conexion = require("../db/conexion");
const bcrypt = require("bcryptjs");

// Registro de usuario
router.post("/registro", async (req, res) => {
    const { nombre, apellido, correo, telefono, contrasena, confirmarContrasena } = req.body;

    //Encriptar contraseña
    const hash = await bcrypt.hash(contrasena, 12);

    //guardar en la bd 
    const sql = "INSERT INTO usuarios (nombre, apellido, correo, telefono, contrasena) VALUES (?, ?, ?, ?, ?)";
    
    // Verificar que los datos se guarden correctamente
    conexion.query(sql, [nombre, apellido, correo, telefono, hash], (error, results) => {
        if(error) {
            console.err("Error al registrar el usuario: ", error);
        }
            res.redirect("/view/usuarios/formulario.html"); 
    });
});

// Inicio de sesión de usuarisos
router.post("/login", (req, res) => {
    const { correo, contrasena } = req.body;

    //Verificar que el usuario exista
    const sql = "SELECT * FROM usuarios WHERE correo = ?";
    conexion.query(sql, [correo], async (error, results) => {
        if(error) {
            console.error("Este usuario no existe: ", error);
        }
        //Definir usuario
        const usuario = results[0];

        // Redireccionar si se logueo
        if(!usuario || !(await bcrypt.compare(contrasena, usuario.contrasena))) {
            return res.status(401).send("Correo o contraseña incorrecta");
        }

        //Guardar en la sesion
        req.session.usuario ={
            id: usuario.id_usuario,
            nombre: usuario.nombre,
            correo: usuario.correo
        };
        res.redirect("/view/usuarios/perfil.html");
    });
});

// Cerrar sesión

module.exports = router;
