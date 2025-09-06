const mysql = require('mysql2');

// Crear conexión
const conexion = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'finhabits'
});

// Probar conexión
conexion.connect((err) => {
  if (err) {
    console.error('Error de conexión: ');
    return;
  }
  console.log('Conectado a la BD');
});

module.exports = conexion;
