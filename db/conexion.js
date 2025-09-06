//importamos mysql12 para la conexion a la base de datos
const mysql = require('mysql2');

//creamos la conexion a la base de datos usando variables de entorno
const conexion = mysql.createConnection ({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

//exportamos la conexion
module.exports = conexion;