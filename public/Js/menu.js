// Función para alternar la visibilidad del menú desplegable
function toggleMenu() {
  const menu = document.getElementById('menuDesplegable');
  menu.classList.toggle('show');
}

// Cerrar el menú si el usuario hace clic fuera de él
window.addEventListener('click', function(event) {
  const menu = document.getElementById('menuDesplegable');
  const perfilIcono = document.querySelector('.perfil-icono');
  
  if (!perfilIcono.contains(event.target)) {
    menu.classList.remove('show');
  }
});
