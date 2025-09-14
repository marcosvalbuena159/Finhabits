const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

app.post("/formulario" , (req, res) => {
    const {nombre, apellido, correo, telefono}=req.body

    const userQuery = "INSERT INTO usuarios (nombre, apellido, correo, telefono) VALUES (?, ?, ?, ?)";

    conexion.query(userQuery, [nombre, apellido, correo, telefono], (error, results) => {
        if (error) {
            console.log("Error al ingresar usuario:", error);
            return res.status(500).send('Error al procesar los datos del usuario.');
        }
    console.log("Usuario ingresado con éxito");
    });
});
