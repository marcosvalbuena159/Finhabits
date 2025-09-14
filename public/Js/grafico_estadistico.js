const finhabitsColors = {
    primary: '#112e54',
    secondary: '#366095',
    accent: '#e0edff',
    light: '#f1f7ff',
    dark: '#1d3e6a'
};

// Gráfico de categorías (Dona)
const categoryCtx = document.getElementById('categoryChart').getContext('2d');
const categoryChart = new Chart(categoryCtx, {
    type: 'doughnut',
    data: {
        labels: ['Alimentación', 'Transporte', 'Vivienda', 'Entretenimiento', 'Salud'],
        datasets: [{
            data: [1200, 800, 1500, 400, 340],
            backgroundColor: [
                finhabitsColors.primary,
                finhabitsColors.secondary,
                finhabitsColors.dark,
                '#2a4f80',
                '#4972a5'
            ],
            borderWidth: 2,
            borderColor: '#000000'
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom'
            }
        }
    }
});

// Gráfico ingresos vs gastos
const incomeExpenseCtx = document.getElementById('incomeExpenseChart').getContext('2d');
const incomeExpenseChart = new Chart(incomeExpenseCtx, {
    type: 'bar',
    data: {
        labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo'],
        datasets: [{
            label: 'Ingresos',
            data: [4500, 4750, 4200, 5100, 4800],
            backgroundColor: finhabitsColors.secondary,
            borderColor: '#000000',
            borderWidth: 2
        }, {
            label: 'Gastos',
            data: [3200, 3400, 2900, 3600, 3240],
            backgroundColor: finhabitsColors.primary,
            borderColor: '#000000',
            borderWidth: 2
        }]
    },
    options: {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

// Gráfico comparativa mensual
const monthlyCtx = document.getElementById('monthlyChart').getContext('2d');
const monthlyChart = new Chart(monthlyCtx, {
    type: 'line',
    data: {
        labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo'],
        datasets: [{
            label: 'Balance Neto',
            data: [1300, 1350, 1300, 1500, 1560],
            borderColor: finhabitsColors.secondary,
            backgroundColor: finhabitsColors.accent,
            borderWidth: 3,
            fill: true,
            tension: 0.4
        }]
    },
    options: {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

// Gráfico de tendencias
const trendsCtx = document.getElementById('trendsChart').getContext('2d');
const trendsChart = new Chart(trendsCtx, {
    type: 'bar',
    data: {
        labels: ['Alimentación', 'Transporte', 'Vivienda', 'Entretenimiento'],
        datasets: [{
            label: 'Mes Actual',
            data: [1200, 800, 1500, 400],
            backgroundColor: finhabitsColors.primary,
            borderColor: '#000000',
            borderWidth: 2
        }, {
            label: 'Mes Anterior',
            data: [1150, 750, 1500, 450],
            backgroundColor: finhabitsColors.secondary,
            borderColor: '#000000',
            borderWidth: 2
        }]
    },
    options: {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

function updateCharts() {
    // Función para actualizar gráficos según filtros
    console.log('Actualizando gráficos...');
    // Aquí se implementaría la lógica para actualizar los datos
}