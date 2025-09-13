let ingresos = [];
let gastos = [];
let deudas = [];
let pagos = [];

// Función para agregar ingreso
function agregarIngreso() {
    const monto = parseFloat(document.getElementById('ingresoMonto').value);
    const procedencia = document.getElementById('ingresoProcedencia').value;

    if (monto > 0 && procedencia) {
        ingresos.push({ monto, procedencia, fecha: new Date() });
        document.getElementById('ingresoMonto').value = '';
        document.getElementById('ingresoProcedencia').value = '';
        actualizarHistorial();
        actualizarTotales();
    } else {
        alert('Por favor, complete todos los campos correctamente.');
    }
}

// Función para agregar gasto
function agregarGasto() {
    const monto = parseFloat(document.getElementById('gastoMonto').value);
    const procedencia = document.getElementById('gastoProcedencia').value;

    if (monto > 0 && procedencia) {
        gastos.push({ monto, procedencia, fecha: new Date() });
        document.getElementById('gastoMonto').value = '';
        document.getElementById('gastoProcedencia').value = '';
        actualizarHistorial();
        actualizarTotales();
    } else {
        alert('Por favor, complete todos los campos correctamente.');
    }
}

// Función para agregar deuda
function agregarDeuda() {
    const monto = parseFloat(document.getElementById('deudaMonto').value);
    const tipo = document.getElementById('deudaTipo').value;

    if (monto > 0 && tipo) {
        deudas.push({ monto, tipo, fecha: new Date() });
        document.getElementById('deudaMonto').value = '';
        document.getElementById('deudaTipo').value = '';
        actualizarHistorial();
        actualizarTotales();
    } else {
        alert('Por favor, complete todos los campos correctamente.');
    }
}

// Función para agregar pago
function agregarPago() {
    const monto = parseFloat(document.getElementById('pagoMonto').value);
    const tipo = document.getElementById('pagoTipo').value;

    if (monto > 0 && tipo) {
        pagos.push({ monto, tipo, fecha: new Date() });
        document.getElementById('pagoMonto').value = '';
        document.getElementById('pagoTipo').value = '';
        actualizarHistorial();
        actualizarTotales();
    } else {
        alert('Por favor, complete todos los campos correctamente.');
    }
}

// Función para formatear moneda
function formatearMoneda(valor) {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(valor);
}

// Función para actualizar totales
function actualizarTotales() {
    const totalIngresos = ingresos.reduce((sum, item) => sum + item.monto, 0);
    const totalGastos = gastos.reduce((sum, item) => sum + item.monto, 0);
    const totalDeudas = deudas.reduce((sum, item) => sum + item.monto, 0);
    const totalPagos = pagos.reduce((sum, item) => sum + item.monto, 0);

    document.getElementById('totalIngresos').textContent = formatearMoneda(totalIngresos);
    document.getElementById('totalGastos').textContent = formatearMoneda(totalGastos);
    document.getElementById('totalDeudas').textContent = formatearMoneda(totalDeudas);
    document.getElementById('totalPagos').textContent = formatearMoneda(totalPagos);
}

// Función para calcular capacidad de ahorro
function calcularCapacidadAhorro() {
    const totalIngresos = ingresos.reduce((sum, item) => sum + item.monto, 0);
    const totalGastos = gastos.reduce((sum, item) => sum + item.monto, 0);
    const totalDeudas = deudas.reduce((sum, item) => sum + item.monto, 0);
    const totalPagos = pagos.reduce((sum, item) => sum + item.monto, 0);

    // Capacidad de ahorro = Ingresos - Gastos - Pagos de deudas
    const capacidadAhorro = totalIngresos - totalGastos - totalPagos;

    document.getElementById('capacidadAhorro').textContent = formatearMoneda(capacidadAhorro);

    // Cambiar color según el resultado
    const elemento = document.querySelector('.capacidad-ahorro');
    if (capacidadAhorro > 0) {
        elemento.style.background = '#d4edda';
        elemento.querySelector('.resultado-label').style.color = '#155724';
        elemento.querySelector('.resultado-valor').style.color = '#155724';
    } else if (capacidadAhorro < 0) {
        elemento.style.background = '#f8d7da';
        elemento.querySelector('.resultado-label').style.color = '#721c24';
        elemento.querySelector('.resultado-valor').style.color = '#721c24';
    } else {
        elemento.style.background = '#e0edff';
        elemento.querySelector('.resultado-label').style.color = '#112e54';
        elemento.querySelector('.resultado-valor').style.color = '#112e54';
    }
}

// Función para actualizar historial
function actualizarHistorial() {
    const historialDiv = document.getElementById('historial');
    historialDiv.innerHTML = '';

    // Combinar todos los elementos y ordenar por fecha
    const todosElementos = [
        ...ingresos.map(item => ({ ...item, tipo: 'ingreso', clase: 'ingreso' })),
        ...gastos.map(item => ({ ...item, tipo: 'gasto', clase: 'gasto' })),
        ...deudas.map(item => ({ ...item, tipo: 'deuda', clase: 'deuda' })),
        ...pagos.map(item => ({ ...item, tipo: 'pago', clase: 'pago' }))
    ].sort((a, b) => b.fecha - a.fecha).slice(0, 5);
    todosElementos.forEach(item => {
        const div = document.createElement('div');
        div.className = `historial-item ${item.clase}`; // Corregida interpolación

        const tipoTexto = item.tipo.charAt(0).toUpperCase() + item.tipo.slice(1);
        const descripcion = item.procedencia || item.tipo;

        div.innerHTML = `
        <span class="historial-tipo">${tipoTexto}: ${descripcion}</span>
        <span class="historial-valor">${formatearMoneda(item.monto)}</span>
    `;

        historialDiv.appendChild(div);
    });


    // Inicializar la calculadora
    document.addEventListener('DOMContentLoaded', function () {
        actualizarTotales();
        actualizarHistorial();
    });
};