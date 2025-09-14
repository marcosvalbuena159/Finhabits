    // Colores de FinHabits
const finhabitsColors = {
    primary: '#112e54',
    secondary: '#366095',
    accent: '#e0edff',
    light: '#f1f7ff',
    dark: '#1d3e6a',
    medium: '#2a4f80'
};

// Configurar el gráfico de flujo de efectivo
const ctx = document.getElementById('cashFlowChart').getContext('2d');
const cashFlowChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep'],
        datasets: [{
            label: 'Ingresos',
            data: [5800, 6200, 5900, 6400, 6000, 6300, 6100, 6200, 6400],
            borderColor: finhabitsColors.secondary,
            backgroundColor: finhabitsColors.accent + '80',
            borderWidth: 3,
            fill: true,
            tension: 0.3,
            pointBackgroundColor: finhabitsColors.secondary,
            pointBorderColor: '#000000',
            pointBorderWidth: 2,
            pointRadius: 6
        }, {
            label: 'Gastos',
            data: [3400, 3200, 3600, 3300, 3500, 3100, 3400, 3240, 3200],
            borderColor: finhabitsColors.primary,
            backgroundColor: finhabitsColors.primary + '40',
            borderWidth: 3,
            fill: true,
            tension: 0.3,
            pointBackgroundColor: finhabitsColors.primary,
            pointBorderColor: '#000000',
            pointBorderWidth: 2,
            pointRadius: 6
        }, {
            label: 'Balance Neto',
            data: [2400, 3000, 2300, 3100, 2500, 3200, 2700, 2960, 3200],
            borderColor: finhabitsColors.dark,
            backgroundColor: 'transparent',
            borderWidth: 4,
            borderDash: [8, 4],
            fill: false,
            tension: 0.2,
            pointBackgroundColor: finhabitsColors.light,
            pointBorderColor: finhabitsColors.dark,
            pointBorderWidth: 3,
            pointRadius: 7
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
                        weight: 'bold',
                        size: 12
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function(value) {
                        return '$' + value.toLocaleString();
                    },
                    font: {
                        weight: '600'
                    }
                },
                grid: {
                    color: '#e0e0e0',
                    lineWidth: 1
                }
            },
            x: {
                grid: {
                    color: '#f0f0f0',
                    lineWidth: 1
                },
                ticks: {
                    font: {
                        weight: '600'
                    }
                }
            }
        },
        elements: {
            point: {
                hoverRadius: 10
            }
        },
        interaction: {
            intersect: false,
            mode: 'index'
        }
    }
});

// Datos para análisis
const financialData = {
    monthlyIncome: 6200,
    monthlyExpenses: 3240,
    savingsRate: 48,
    balance: 4750,
    expenses: {
        vivienda: { amount: 1200, percentage: 37, icon: 'home' },
        alimentacion: { amount: 650, percentage: 20, icon: 'utensils' },
        transporte: { amount: 480, percentage: 15, icon: 'car' },
        entretenimiento: { amount: 320, percentage: 10, icon: 'gamepad' },
        salud: { amount: 280, percentage: 9, icon: 'heartbeat' },
        otros: { amount: 310, percentage: 9, icon: 'ellipsis-h' }
    }
};

// Función para actualizar datos en tiempo real
function updateFinancialData() {
    // Simular cambios en los datos
    const variation = (Math.random() - 0.5) * 200;
    
    // Actualizar valores con animación
    const balanceElement = document.querySelector('.summary-card .card-value');
    if (balanceElement) {
        animateValue(balanceElement, financialData.balance, financialData.balance + variation, 1000);
    }
    
    // Actualizar gráfico con nuevos datos
    const newData = cashFlowChart.data.datasets[2].data.map(value => 
        Math.max(0, value + (Math.random() - 0.5) * 300)
    );
    
    cashFlowChart.data.datasets[2].data = newData;
    cashFlowChart.update('active');
}

// Función para animar valores numéricos
function animateValue(element, start, end, duration) {
    const startTime = performance.now();
    const difference = end - start;
    
    function updateValue(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const currentValue = start + (difference * progress);
        element.textContent = '$' + Math.round(currentValue).toLocaleString();
        
        if (progress < 1) {
            requestAnimationFrame(updateValue);
        }
    }
    
    requestAnimationFrame(updateValue);
}

// Función para generar insights dinámicos
function generateInsights() {
    const insights = [
        {
            text: 'Tus gastos en alimentación han disminuido',
            value: '-12% vs mes anterior',
            type: 'positive'
        },
        {
            text: 'Mejor mes para ahorros en el trimestre',
            value: '$2,960 ahorrado',
            type: 'positive'
        },
        {
            text: 'Gastos de transporte por encima del promedio',
            value: '+8% del presupuesto',
            type: 'warning'
        },
        {
            text: 'Tasa de ahorro objetivo alcanzada',
            value: '48% vs 45% meta',
            type: 'positive'
        }
    ];
    
    return insights;
}

// Función para generar recomendaciones basadas en datos
function generateRecommendations() {
    const recommendations = [
        {
            priority: 'high',
            text: 'Considera reducir gastos de entretenimiento para mejorar tu tasa de ahorro.',
            action: 'Revisa suscripciones y gastos no esenciales'
        },
        {
            priority: 'medium',
            text: 'Revisa tus gastos de transporte. Podrías ahorrar usando transporte público.',
            action: 'Evalúa alternativas de movilidad'
        },
        {
            priority: 'low',
            text: 'Excelente trabajo manteniendo bajos los gastos de alimentación.',
            action: 'Continúa con tus hábitos actuales'
        },
        {
            priority: 'medium',
            text: 'Considera aumentar tu fondo de emergencia con el excedente del mes.',
            action: 'Destina $500 adicionales al fondo'
        }
    ];
    
    return recommendations;
}

// Función para calcular tendencias
function calculateTrends() {
    const currentMonth = financialData.monthlyIncome - financialData.monthlyExpenses;
    const previousMonth = 2800; // Dato simulado
    
    const trend = ((currentMonth - previousMonth) / previousMonth * 100).toFixed(1);
    
    return {
        current: currentMonth,
        previous: previousMonth,
        trend: trend,
        isPositive: trend > 0
    };
}

// Función para análisis de categorías de gastos
function analyzeCategoricalSpending() {
    const categories = Object.entries(financialData.expenses);
    const analysis = categories.map(([category, data]) => {
        const recommendation = getSpendingRecommendation(category, data.percentage);
        return {
            category,
            ...data,
            recommendation
        };
    });
    
    return analysis.sort((a, b) => b.amount - a.amount);
}

// Función para obtener recomendaciones por categoría
function getSpendingRecommendation(category, percentage) {
    const recommendations = {
        vivienda: percentage > 35 ? 'Alto - Considera opciones más económicas' : 'Dentro del rango recomendado',
        alimentacion: percentage > 25 ? 'Revisa tus hábitos alimenticios' : 'Buen control de gastos',
        transporte: percentage > 15 ? 'Busca alternativas más económicas' : 'Gastos controlados',
        entretenimiento: percentage > 15 ? 'Reduce gastos no esenciales' : 'Balance adecuado',
        salud: percentage < 5 ? 'Considera aumentar inversión en salud' : 'Inversión adecuada',
        otros: percentage > 10 ? 'Categoriza mejor tus gastos' : 'Misceláneos controlados'
    };
    
    return recommendations[category] || 'Sin recomendación específica';
}

// Función para exportar análisis
function exportAnalysis() {
    const analysisData = {
        date: new Date().toLocaleDateString(),
        summary: {
            balance: financialData.balance,
            income: financialData.monthlyIncome,
            expenses: financialData.monthlyExpenses,
            savingsRate: financialData.savingsRate
        },
        trends: calculateTrends(),
        categoryAnalysis: analyzeCategoricalSpending(),
        insights: generateInsights(),
        recommendations: generateRecommendations()
    };
    
    const dataStr = JSON.stringify(analysisData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = 'analisis_financiero_' + new Date().toISOString().split('T')[0] + '.json';
    link.click();
}

// Función para configurar alertas personalizadas
function setupAlerts() {
    const alerts = {
        highSpending: financialData.monthlyExpenses > 3500,
        lowSavings: financialData.savingsRate < 20,
        budgetExceeded: Object.values(financialData.expenses).some(category => category.percentage > 40)
    };
    
    if (alerts.highSpending) {
        showAlert('Gastos elevados este mes', 'warning');
    }
    
    if (alerts.lowSavings) {
        showAlert('Tasa de ahorro por debajo del objetivo', 'error');
    }
    
    if (alerts.budgetExceeded) {
        showAlert('Una categoría excede el 40% del presupuesto', 'warning');
    }
    
    return alerts;
}

// Función para mostrar alertas
function showAlert(message, type) {
    console.log(`[${type.toUpperCase()}] ${message}`);
    // Aquí se podría implementar un sistema de notificaciones visual
}

// Función para animación de entrada de elementos
function animateElements() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    });
    
    const elements = document.querySelectorAll('.summary-card, .chart-card, .insights-card, .recommendations-card, .breakdown-item');
    elements.forEach((el) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
}
