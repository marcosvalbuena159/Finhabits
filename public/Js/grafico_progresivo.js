// Colores de FinHabits
const finhabitsColors = {
    primary: '#112e54',
    secondary: '#366095',
    accent: '#e0edff',
    light: '#f1f7ff',
    dark: '#1d3e6a'
};

// Datos iniciales
let chartData = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago'],
    actual: [800, 1600, 2400, 3200, 4000, 4800, 5600, 6400],
    objetivo: [833, 1666, 2500, 3333, 4166, 5000, 5833, 6666]
};

// Configurar el gráfico
const ctx = document.getElementById('progressChart').getContext('2d');
const progressChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: chartData.labels,
        datasets: [{
            label: 'Progreso Real',
            data: chartData.actual,
            borderColor: finhabitsColors.secondary,
            backgroundColor: finhabitsColors.accent + '80',
            borderWidth: 4,
            fill: true,
            tension: 0.3,
            pointBackgroundColor: finhabitsColors.primary,
            pointBorderColor: '#000000',
            pointBorderWidth: 2,
            pointRadius: 6
        }, {
            label: 'Objetivo Planificado',
            data: chartData.objetivo,
            borderColor: finhabitsColors.primary,
            backgroundColor: 'transparent',
            borderWidth: 3,
            borderDash: [10, 5],
            fill: false,
            tension: 0.1,
            pointBackgroundColor: finhabitsColors.accent,
            pointBorderColor: finhabitsColors.primary,
            pointBorderWidth: 2,
            pointRadius: 5
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    usePointStyle: true,
                    padding: 20,
                    font: {
                        weight: 'bold'
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function (value) {
                        return '$' + value.toLocaleString();
                    }
                },
                grid: {
                    color: '#e0e0e0'
                }
            },
            x: {
                grid: {
                    color: '#e0e0e0'
                }
            }
        },
        elements: {
            point: {
                hoverRadius: 8
            }
        }
    }
});

function updateProgression() {
    const metaAmount = parseFloat(document.getElementById('metaAmount').value) || 10000;
    const plazoMeses = parseInt(document.getElementById('plazoMeses').value) || 12;
    const ahorroMensual = parseFloat(document.getElementById('ahorroMensual').value) || 800;

    // Calcular progreso
    const ahorroActual = ahorroMensual * 8; // Simulando 8 meses
    const progressTotal = Math.round((ahorroActual / metaAmount) * 100);
    const progressMensual = Math.round((640 / ahorroMensual) * 100); // Simulando ahorro actual del mes

    // Actualizar indicadores
    document.getElementById('progressTotal').textContent = progressTotal + '%';
    document.getElementById('progressFillTotal').style.width = progressTotal + '%';
    document.getElementById('ahorroActual').textContent = '$' + ahorroActual.toLocaleString();
    document.getElementById('metaTotal').textContent = '$' + metaAmount.toLocaleString();

    document.getElementById('progressMensual').textContent = progressMensual + '%';
    document.getElementById('progressFillMensual').style.width = progressMensual + '%';
    document.getElementById('metaMensual').textContent = '$' + ahorroMensual.toLocaleString();

    // Actualizar gráfico
    const newObjective = [];
    const newActual = [];
    for (let i = 1; i <= 8; i++) {
        newObjective.push((metaAmount / plazoMeses) * i);
        newActual.push(ahorroMensual * i);
    }

    progressChart.data.datasets[0].data = newActual;
    progressChart.data.datasets[1].data = newObjective;
    progressChart.update();

    // Animación de barras de progreso
    setTimeout(() => {
        const fills = document.querySelectorAll('.progress-fill');
        fills.forEach(fill => {
            const width = fill.style.width;
            fill.style.width = '0%';
            setTimeout(() => {
                fill.style.width = width;
            }, 100);
        });
    }, 100);
}

// Inicializar con animación
document.addEventListener('DOMContentLoaded', function () {
    updateProgression();
});