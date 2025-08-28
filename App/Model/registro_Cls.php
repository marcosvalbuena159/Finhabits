<?php
require_once('../../config/conexion.php'); // Cambiado para coincidir con tu estructura

class clsRegistro extends clsConexion
{
    // Variables del registro (según estructura BD usuarios)
    private $nombre;
    private $apellido;
    private $correo;
    private $contrasena;
    private $telefono;
    
    private $db;

    public function __construct()
    {
        $this->db = parent::__construct();
    }

    // Encapsulamiento de Variables de Registro
    public function setNombre($nom)
    {
        $this->nombre = $nom;
    }
    public function getNombre()
    {
        return $this->nombre;
    }
    
    public function setApellido($ape)
    {
        $this->apellido = $ape;
    }
    public function getApellido()
    {
        return $this->apellido;
    }
    
    public function setCorreo($cor)
    {
        $this->correo = $cor;
    }
    public function getCorreo()
    {
        return $this->correo;
    }
    
    public function setTelefono($tel)
    {
        $this->telefono = $tel;
    }
    public function getTelefono()
    {
        return $this->telefono;
    }
    
    public function setContrasena($con)
    {
        $this->contrasena = $con;
    }
    public function getContrasena()
    {
        return $this->contrasena;
    }

    public function registrarUsuario()
    {
        try {
            // Verificar si el correo ya existe
            $consultaExiste = $this->db->prepare("SELECT COUNT(*) FROM usuarios WHERE correo = :correo");
            $consultaExiste->bindParam(':correo', $this->correo);
            $consultaExiste->execute();
            
            if($consultaExiste->fetchColumn() > 0) {
                header('location: ../View/Registro.html?mensaje=correoeexiste');
                return;
            }

            // Encriptar contraseña
            $contrasenaHash = password_hash($this->contrasena, PASSWORD_DEFAULT);
            $activo = 1; // Campo activo por defecto según tu BD
            $rolId = 2; // Rol "Usuario" según tus datos iniciales

            // Insertar nuevo usuario según tu estructura exacta de BD
            $consulta = $this->db->prepare("INSERT INTO usuarios (nombre, apellido, correo, contrasena, telefono, activo, id_rol) 
                                          VALUES (:nom, :ape, :cor, :pass, :tel, :act, :rol)");
            $consulta->bindParam(':nom', $this->nombre);
            $consulta->bindParam(':ape', $this->apellido);
            $consulta->bindParam(':cor', $this->correo);
            $consulta->bindParam(':pass', $contrasenaHash);
            $consulta->bindParam(':tel', $this->telefono);
            $consulta->bindParam(':act', $activo);
            $consulta->bindParam(':rol', $rolId);
            $consulta->execute();
            
            header('location: ../View/Registro.html?mensaje=ingreso');
        }
        catch (PDOException $error) {
            header('location: ../View/Registro.html?mensaje=noingreso');
        }
    }
}
?>