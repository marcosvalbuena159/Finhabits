// Importamos variales y frameworks necesarios
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const session = require("express-session");
const usuarios = require("./routes/usuarios");

const app = express();
const port = process.env.PORT || 3000; // Definimos el puerto

//Permitimos conexion entre back y front
app.use(express.urlencoded({ extended: true })); //leer formularios HTML
app.use(cors());
app.use(express.json());

//Importamos la conexion a la base de datos
const conexion = require("./db/conexion");

//Configuracion de la session
app.use(session({
    secret: "210424*#$Finhabits", 
    resave: false,
    saveUninitialized: false,
}));

//Rutas de usuario
app.use("/", usuarios);

//Aceptamos archivos estaticos
app.use(express.static("public"));

//Importamos las rutas
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "view", "index.html"));
});
app.get("/home", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "view", "home.html"));
});
app.get("/finanzas", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "view", "finanzas.html"));
});
app.get("/Ayuda", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "view", "Ayuda.html"));
});
app.get("/Nosotros", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "view", "Nosotros.html"));
});
app.get("/Noticias", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "view", "Noticias.html"));
});
app.get("/Registro", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "view", "Registro.html"));
});
app.get("/Inicio_Sesion", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "view", "Inicio_Sesion.html"));
});
app.get("/Perfil", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "view", "usuarios", "perfilU.html"));
});
app.get("/Formulario", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "view", "usuarios", "formulario.html"));
});
app.get("/Reportes", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "view", "usuarios", "reportes.html"));
});
app.get("/Gestion_Trasacciones", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "view", "usuarios", "gestion_trasacciones.html"));
});
app.get("/Metas", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "view", "usuarios", "gestion_metas.html"));
});
app.get("/Ingresos_Gastos", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "view", "usuarios", "ingreso_gasto.html"));
});
app.get("/Inversiones", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "view", "usuarios", "inversiones.html"));
});
app.get("/Historial", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "view", "usuarios", "historial.html"));
});
app.get("/Calculadora", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "view", "usuarios", "calculadora.html"));
});
app.get("/Recuperar_Contrasena", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "view", "recuperar_contraseña.html"));
});
app.get("/Cambio_Contrasena", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "view", "cambio_contraseña.html"));
});


//Iniciamos el servidor
app.listen(port, () => {    
    console.log('Servidor corriendo en el puerto ' + port);
});