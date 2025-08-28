<?php
class clsConexion{
    private $host = 'localhost';
    private $db_name = 'finhabits'; // Cambia esto por tu BD real si es diferente
    private $username = 'root';
    private $password = '';
    private $conn;

    public function __construct()
    {
        try
        {
            $this->conn = new PDO("mysql:host=".$this->host.";dbname=".$this->db_name, $this->username, $this->password);  
            $this->conn->exec("set names utf8mb4");
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            return $this->conn;
        }
        catch(PDOException $error)
        {
            die("Error al conectar: ".$error->getMessage());
        }
    }

    public function getConnection()
    {
        return $this->conn;
    }
}
?>