<?php
require_once('../../config/conexion.php');

class clsLogin extends clsConexion
{
    // Variables del login
    private $correo;
    private $contrasena;
    private $db;

    public function __construct()
    {
        $this->db = parent::__construct();
    }

    // Encapsulamiento de Variables de Login
    public function setCorreo($cor)
    {
        $this->correo = $cor;
    }
    public function getCorreo()
    {
        return $this->correo;
    }
    
    public function setContrasena($con)
    {
        $this->contrasena = $con;
    }
    public function getContrasena()
    {
        return $this->contrasena;
    }

    public function Login()
    {
        try {
            $consulta = $this->db->prepare("SELECT * FROM usuarios WHERE correo = :correo AND activo = 1");
            $consulta->bindParam(':correo', $this->correo);
            $consulta->execute();

            if($consulta->rowCount() == 1)
            {
                $usuario = $consulta->fetch(PDO::FETCH_ASSOC);
                // Verificar la contraseña hasheada
                if(password_verify($this->contrasena, $usuario['contrasena']))
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
            else
            {
                return false;
            }
        }
        catch (PDOException $error)
        {
            return false;
        }
    }

    public function consulta_datos_login()
    {
        try {
            $consulta = $this->db->prepare("SELECT u.id_usuario, u.nombre, u.apellido, u.correo, u.telefono, 
                                          u.id_rol, r.nombre as nombre_rol
                                          FROM usuarios u
                                          LEFT JOIN roles r ON u.id_rol = r.id_rol
                                          WHERE u.correo = :correo AND u.activo = 1");
            $consulta->bindParam(':correo', $this->correo);
            $filas = null;
            $consulta->execute();

            $filas = $consulta->fetchAll(PDO::FETCH_ASSOC);
            
            return $filas;
        }
        catch (PDOException $error)
        {
            return null;
        }
    }

    public function registrarSesion($idUsuario)
    {
        try {
            // Obtener información del cliente
            $ip = $this->obtenerIP();
            $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? 'Desconocido';
            
            // Insertar nueva sesión
            $consulta = $this->db->prepare("INSERT INTO sesiones (id_usuario, ip, user_agent, activa) 
                                          VALUES (:usuario, :ip, :user_agent, 1)");
            $consulta->bindParam(':usuario', $idUsuario);
            $consulta->bindParam(':ip', $ip);
            $consulta->bindParam(':user_agent', $userAgent);
            $consulta->execute();
            
            return true;
        }
        catch (PDOException $error)
        {
            return false;
        }
    }

    public function cerrarSesion($idUsuario)
    {
        try {
            // Marcar sesiones como inactivas
            $consulta = $this->db->prepare("UPDATE sesiones 
                                          SET activa = 0, fecha_fin = NOW() 
                                          WHERE id_usuario = :usuario AND activa = 1");
            $consulta->bindParam(':usuario', $idUsuario);
            $consulta->execute();
            
            return true;
        }
        catch (PDOException $error)
        {
            return false;
        }
    }

    private function obtenerIP()
    {
        // Obtener la IP real del cliente
        if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
            return $_SERVER['HTTP_CLIENT_IP'];
        } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
            return $_SERVER['HTTP_X_FORWARDED_FOR'];
        } else {
            return $_SERVER['REMOTE_ADDR'] ?? 'Desconocida';
        }
    }

    public function verificarSesionActiva($idUsuario)
    {
        try {
            $consulta = $this->db->prepare("SELECT COUNT(*) 
                                          FROM sesiones 
                                          WHERE id_usuario = :usuario 
                                          AND activa = 1 
                                          AND DATE(fecha_inicio) = CURDATE()");
            $consulta->bindParam(':usuario', $idUsuario);
            $consulta->execute();
            
            return $consulta->fetchColumn() > 0;
        }
        catch (PDOException $error)
        {
            return false;
        }
    }
}
?>