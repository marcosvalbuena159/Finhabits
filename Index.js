require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const session = require("express-session");
const usuarios = require("./routes/usuarios");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());

const conexion = require("./db/conexion");

app.use(session({
    secret: "210424*#$Finhabits", 
    resave: false,
    saveUninitialized: false,
}));

app.use("/", usuarios);

app.use(express.static("public"));

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
app.get("/Inversiones_Fondos", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "view", "usuarios", "inversiones_fondos.html"));
});
app.get("/Deudas_Ahorros", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "view", "usuarios", "deudas_ahorros.html"));
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
app.get("/Analisis_Graficos", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "view", "usuarios","analisis_graficos.html"));
});
app.get("/Analisis", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "view", "usuarios", "analisis.html"));
});
app.get("/Grafico_Estadistico", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "view", "usuarios", "grafico_estadistico.html"));
});
app.get("/Grafico_Progresivo", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "view", "usuarios","grafico_progresivo.html"));
});
app.get("/Grafico_Metas", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "view", "usuarios","grafico_metas.html"));
});

app.listen(port, () => {    
    console.log('Servidor corriendo en el puerto ' + port);
});