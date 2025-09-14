const goalsData = [
    {
        id: 1,
        name: "Fondo de Emergencia",
        category: "emergencia",
        targetAmount: 10000,
        currentAmount: 7500,
        targetDate: "2025-12-31",
        status: "en-progreso"
    },
    {
        id: 2,
        name: "Vacaciones Europa",
        category: "viajes",
        targetAmount: 5000,
        currentAmount: 5000,
        targetDate: "2025-06-15",
        status: "completada"
    },
    {
        id: 3,
        name: "Inversión Acciones",
        category: "inversiones",
        targetAmount: 15000,
        currentAmount: 8200,
        targetDate: "2025-10-31",
        status: "en-progreso"
    },
    {
        id: 4,
        name: "Pagar Tarjeta de Crédito",
        category: "deudas",
        targetAmount: 3000,
        currentAmount: 2800,
        targetDate: "2025-03-15",
        status: "vencida"
    },
    {
        id: 5,
        name: "Curso MBA",
        category: "educacion",
        targetAmount: 8000,
        currentAmount: 8000,
        targetDate: "2025-01-31",
        status: "completada"
    }
];

// Variables para los gráficos
let goalsStatusChart, categoryProgressChart, monthlyProgressChart, amountDistributionChart;

// Inicializar la página
document.addEventListener('DOMContentLoaded', function () {
    initializeCharts();
    updateGoalsProgressList();
});

// Función para inicializar todos los gráficos
function initializeCharts() {
    // Gráfico de estado de metas
    const statusCtx = document.getElementById('goalsStatusChart').getContext('2d');
    goalsStatusChart = new Chart(statusCtx, {
        type: 'doughnut',
        data: {
            labels: ['Completadas', 'En Progreso', 'Vencidas', 'Pendientes'],
            datasets: [{
                data: [2, 2, 1, 0],
                backgroundColor: ['#10b981', '#f59e0b', '#ef4444', '#6b7280'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });

    // Gráfico de progreso por categoría
    const categoryCtx = document.getElementById('categoryProgressChart').getContext('2d');
    categoryProgressChart = new Chart(categoryCtx, {
        type: 'bar',
        data: {
            labels: ['Emergencia', 'Viajes', 'Inversiones', 'Deudas', 'Educación'],
            datasets: [{
                label: 'Progreso (%)',
                data: [75, 100, 55, 93, 100],
                backgroundColor: '#3b82f6',
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });

    // Gráfico de evolución mensual
    const monthlyCtx = document.getElementById('monthlyProgressChart').getContext('2d');
    monthlyProgressChart = new Chart(monthlyCtx, {
        type: 'line',
        data: {
            labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep'],
            datasets: [{
                label: 'Metas Completadas',
                data: [0, 1, 1, 2, 2, 3, 3, 4, 5],
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                fill: true,
                tension: 0.4
            }, {
                label: 'Nuevas Metas',
                data: [2, 1, 2, 1, 1, 0, 1, 0, 0],
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Gráfico de distribución por monto
    const amountCtx = document.getElementById('amountDistributionChart').getContext('2d');
    amountDistributionChart = new Chart(amountCtx, {
        type: 'pie',
        data: {
            labels: ['$0-$5K', '$5K-$10K', '$10K-$15K', '+$15K'],
            datasets: [{
                data: [2, 2, 1, 0],
                backgroundColor: ['#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Función para actualizar la lista de progreso de metas
function updateGoalsProgressList() {
    const container = document.getElementById('goalsProgressList');
    container.innerHTML = '';

    goalsData.forEach(goal => {
        const progress = (goal.currentAmount / goal.targetAmount) * 100;
        const statusClass = getStatusClass(goal.status);
        const statusText = getStatusText(goal.status);

        const goalItem = document.createElement('div');
        goalItem.className = 'goal-progress-item';
        goalItem.innerHTML = `
                    <div class="goal-info">
                        <h4 class="goal-name">${goal.name}</h4>
                        <div class="goal-details">
                            <span class="goal-category">${goal.category}</span>
                            <span class="goal-status ${statusClass}">${statusText}</span>
                        </div>
                        <div class="goal-amounts">
                            <span>$${goal.currentAmount.toLocaleString()} / $${goal.targetAmount.toLocaleString()}</span>
                            <span class="goal-date">Fecha objetivo: ${new Date(goal.targetDate).toLocaleDateString()}</span>
                        </div>
                    </div>
                    <div class="goal-progress">
                        <div class="progress-circle">
                            <div class="progress-value">${Math.round(progress)}%</div>
                        </div>
                        <div class="progress-bar-container">
                            <div class="progress-bar">
                                <div class="progress-fill ${statusClass}" style="width: ${progress}%"></div>
                            </div>
                        </div>
                    </div>
                `;
        container.appendChild(goalItem);
    });
}

// Función para obtener la clase CSS del estado
function getStatusClass(status) {
    switch (status) {
        case 'completada': return 'success';
        case 'en-progreso': return 'progress';
        case 'vencida': return 'danger';
        default: return 'pending';
    }
}

// Función para obtener el texto del estado
function getStatusText(status) {
    switch (status) {
        case 'completada': return 'Completada';
        case 'en-progreso': return 'En Progreso';
        case 'vencida': return 'Vencida';
        default: return 'Pendiente';
    }
}

// Función para actualizar gráficos con filtros
function updateCharts() {
    // Aquí se implementaría la lógica para filtrar los datos
    console.log('Actualizando gráficos con filtros...');
}