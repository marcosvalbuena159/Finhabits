<?php
require_once('../Model/registro_Cls.php');

if(isset($_POST) && !empty($_POST))
{
    // Variables de captura de inputs
    $nombre = trim($_POST['nombre'] ?? '');
    $apellido = trim($_POST['apellido'] ?? '');
    $correo = trim($_POST['correo'] ?? '');
    $telefono = trim($_POST['telefono'] ?? '');
    $contrasena = $_POST['contrasena'] ?? '';

    // Defino el objeto registro para conectar con la clase registro y usar sus métodos y variables
    $objRegistro = new clsRegistro();

    // Guardo en las variables de la clase registro los valores ingresados
    $objRegistro->setNombre($nombre);
    $objRegistro->setApellido($apellido);
    $objRegistro->setCorreo(strtolower($correo));
    $objRegistro->setTelefono($telefono);
    $objRegistro->setContrasena($contrasena);

    // Ejecutar el registro
    $objRegistro->registrarUsuario();
}
?>