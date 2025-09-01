// Importar express
const express = require("express");
const path = require("path");
const conexion = require("./App/Db/Conexion"); //Exportamos la conexion
const registroRoutes = require("./App/Controller/Registro");
const loginRoutes = require("./App/Controller/Login");
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para procesar datos del body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Ruta principal
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "App", "View", "Index.html"));
});

// Archivos estaticos
app.use(express.static('Public'));

//rutas adicionales
app.get("/home", (req, res) => {
  res.sendFile(path.join(__dirname, "App", "View", "home.html"));
});

app.get("/Registro", (req, res) => {
  res.sendFile(path.join(__dirname, "App", "View", "Registro.html"));
});

app.get("/Inicio_Sesion", (req, res) => {
  res.sendFile(path.join(__dirname, "App", "View", "Inicio_Sesion.html"));
});

app.get("/Noticias", (req, res) => {
  res.sendFile(path.join(__dirname, "App", "View", "Noticias.html"));
});

app.get("/Nosotros", (req, res) => {
  res.sendFile(path.join(__dirname, "App", "View", "Nosotros.html"));
});

app.get("/finanzas", (req, res) => {
  res.sendFile(path.join(__dirname, "App", "View", "finanzas.html"));
});

app.get("/Ayuda", (req, res) => {
  res.sendFile(path.join(__dirname, "App", "View", "Ayuda.html"));
});

// Rutas de usuarios
app.use('/usuarios', registroRoutes); 
app.use('/usuarios', loginRoutes);   


// Levantar servidor
app.listen(PORT, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});