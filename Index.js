// Importar express
const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Servir archivos estáticos desde "Public"
app.use(express.static('Public'));

// Ruta principal
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "App", "View", "Index.html"));
});

//rutas adicionales
app.get("/home", (req, res) => {
  res.sendFile(path.join(__dirname, "App", "View", "home.html"));
});

app.get("/finanzas", (req, res) => {
  res.sendFile(path.join(__dirname, "App", "View", "finanzas.html"));
});

app.get("/noticias", (req, res) => {
  res.sendFile(path.join(__dirname, "App", "View", "Noticias.html"));
});

app.get("/ayuda", (req, res) => {
  res.sendFile(path.join(__dirname, "App", "View", "Ayuda.html"));
});

app.get("/nosotros", (req, res) => {
  res.sendFile(path.join(__dirname, "App", "View", "Nosotros.html"));
});

app.get("/registro", (req, res) => {
  res.sendFile(path.join(__dirname, "App", "View", "Registro.html"));
});


app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "App", "View", "Inicio_Sesion.html"));
});

// Levantar servidor
app.listen(PORT, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});