<?php
session_start();
require_once('../Model/login_Cls.php');

// Verificar si hay una sesión activa
if(isset($_SESSION['sesion_iniciada']) && $_SESSION['sesion_iniciada'] === true) {
    $objLogin = new clsLogin();
    
    // Cerrar sesión en la base de datos
    if(isset($_SESSION['usuario_id'])) {
        $objLogin->cerrarSesion($_SESSION['usuario_id']);
    }
}

// Destruir la sesión
session_destroy();

// Redirigir a la página principal
header('location: ../../home.html?mensaje=logout');
exit;
?>