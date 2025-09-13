let currentSection = 1;
const totalSections = 6;

const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const submitBtn = document.getElementById('submitBtn');
const progressFill = document.getElementById('progressFill');

// Función para mostrar/ocultar secciones
function showSection(sectionNumber) {
    // Ocultar todas las secciones
    for (let i = 1; i <= totalSections; i++) {
        document.getElementById(`section${i}`).classList.remove('active');
        document.querySelector(`.step[data-step="${i}"]`).classList.remove('active');
    }

    // Mostrar la sección actual
    document.getElementById(`section${sectionNumber}`).classList.add('active');
    document.querySelector(`.step[data-step="${sectionNumber}"]`).classList.add('active');

    // Actualizar barra de progreso
    const progress = (sectionNumber - 1) / (totalSections - 1) * 100;
    progressFill.style.width = `${progress}%`;

    // Controlar visibilidad de botones
    prevBtn.style.display = sectionNumber === 1 ? 'none' : 'inline-block';
    nextBtn.style.display = sectionNumber === totalSections ? 'none' : 'inline-block';
    submitBtn.style.display = sectionNumber === totalSections ? 'inline-block' : 'none';
}

// Función para validar campos obligatorios de la sección actual
function validateCurrentSection() {
    const currentSectionElement = document.getElementById(`section${currentSection}`);
    const requiredFields = currentSectionElement.querySelectorAll('[required]');

    for (let field of requiredFields) {
        if (!field.value.trim()) {
            field.classList.add('error');
            field.focus();
            return false;
        } else {
            field.classList.remove('error');
        }
    }

    // Validación especial para checkboxes obligatorios
    if (currentSection === 6) {
        const terminos = document.getElementById('aceptarTerminos');
        if (!terminos.checked) {
            alert('Debe aceptar los términos y condiciones para continuar.');
            return false;
        }
    }

    return true;
}

// Event listeners para botones
nextBtn.addEventListener('click', function () {
    if (validateCurrentSection()) {
        currentSection++;
        showSection(currentSection);
    }
});

prevBtn.addEventListener('click', function () {
    currentSection--;
    showSection(currentSection);
});

// Manejar envío del formulario
document.getElementById('personalForm').addEventListener('submit', function (e) {
    e.preventDefault();

    if (validateCurrentSection()) {
        // Aquí puedes agregar la lógica para enviar los datos
        alert('¡Formulario enviado exitosamente!');
        console.log('Datos del formulario:', new FormData(this));
        window.location.href = 'perfilU.html';
    }
});

// Lógica para checkbox "Sin deudas"
document.addEventListener('change', function (e) {
    if (e.target.name === 'deudas' && e.target.value === 'sin-deudas') {
        const deudaCheckboxes = document.querySelectorAll('input[name="deudas"]:not([value="sin-deudas"])');
        if (e.target.checked) {
            deudaCheckboxes.forEach(cb => cb.checked = false);
        }
    } else if (e.target.name === 'deudas' && e.target.value !== 'sin-deudas') {
        const sinDeudasCheckbox = document.querySelector('input[name="deudas"][value="sin-deudas"]');
        if (e.target.checked && sinDeudasCheckbox.checked) {
            sinDeudasCheckbox.checked = false;
        }
    }
});

// Navegación con teclado
document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight' || e.key === 'Enter') {
        if (currentSection < totalSections && nextBtn.style.display !== 'none') {
            nextBtn.click();
        }
    } else if (e.key === 'ArrowLeft') {
        if (currentSection > 1) {
            prevBtn.click();
        }
    }
});

// Inicializar formulario
showSection(currentSection);