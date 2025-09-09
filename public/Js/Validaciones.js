const nombre = document.getElementById("nombre");
const apellido = document.getElementById("apellido");
const email = document.getElementById("correo");
const telefono = document.getElementById("telefono");
const password = document.getElementById("passwordInput1");
const password2 = document.getElementById("passwordInput2");

const form = document.getElementById("registerForm");
const parrafo = document.getElementById("Error");

form.addEventListener("submit", e=>{
    if(nombre.nodeValue.length < 2){
        alert("El nombre debe tener al menos 2 caracteres")
    }
})