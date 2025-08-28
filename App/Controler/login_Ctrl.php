<?php
require_once('../Model/login_Cls.php');

if(isset($_POST) && !empty($_POST))
{
    // Variables de captura de inputs
    $correo = trim($_POST['correo'] ?? '');
    $contrasena = $_POST['contrasena'] ?? '';

    // Defino el objeto login para conectar con la clase login y usar sus métodos y variables
    $objLogin = new clsLogin();

    // Guardo en las variables de la clase login los valores ingresados
    $objLogin->setCorreo(strtolower($correo));
    $objLogin->setContrasena($contrasena);

    // Verificar login
    if($objLogin->Login() == true)
    {
        $filas = $objLogin->consulta_datos_login();
        if($filas != null)
        {
            foreach($filas as $fila)
            {
                $idUsuario = $fila['id_usuario'];
                $nombreUsuario = $fila['nombre'];
                $apellidoUsuario = $fila['apellido'];
                $correoUsuario = $fila['correo'];
                $rolUsuario = $fila['id_rol'];
                $nombreRol = $fila['nombre_rol'] ?? 'Usuario';
            }
            
            session_start();
            $_SESSION['usuario_id'] = $idUsuario;
            $_SESSION['usuario_nombre'] = $nombreUsuario;
            $_SESSION['usuario_apellido'] = $apellidoUsuario;
            $_SESSION['usuario_correo'] = $correoUsuario;
            $_SESSION['usuario_rol'] = $rolUsuario;
            $_SESSION['nombre_rol'] = $nombreRol;
            $_SESSION['sesion_iniciada'] = true;
            $_SESSION['ultimo_acceso'] = time();

            // Registrar sesión en la base de datos
            $objLogin->registrarSesion($idUsuario);
        }
        header('location: ../view/usuarios/formulario.html?mensaje=loginexitoso');
    }
    else
    {
        header('location: ../View/Inicio_Sesion.html?mensaje=error');
    }
}
?>