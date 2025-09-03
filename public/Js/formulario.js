//Desplegar el menu de usuario
document.addEventListener("DOMContentLoaded", function () {
    const userMenu = document.querySelector(".user-menu");

    userMenu.addEventListener("click", function (e) {
        e.preventDefault();
        userMenu.classList.toggle("active");
    });
});

//Validacion de formulario