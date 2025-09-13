class SharedGoalsManager {
    constructor() {
        this.storageKey = 'finhabits_goals';
        this.goals = this.loadGoalsFromStorage();
    }

    // Cargar metas desde almacenamiento del navegador
    loadGoalsFromStorage() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                return JSON.parse(stored);
            }
        } catch (e) {
            console.error('Error loading goals from storage:', e);
        }
        
        // Datos iniciales de ejemplo si no hay nada guardado
        return [
        ];
    }

    // Guardar metas en almacenamiento del navegador
    saveGoalsToStorage() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.goals));
            // Disparar evento personalizado para notificar cambios
            window.dispatchEvent(new CustomEvent('goalsUpdated', { 
                detail: { goals: this.goals } 
            }));
        } catch (e) {
            console.error('Error saving goals to storage:', e);
        }
    }

    // Obtener todas las metas
    getAllGoals() {
        return [...this.goals];
    }

    // Agregar nueva meta
    addGoal(goalData) {
        const newGoal = {
            id: Math.max(...this.goals.map(g => g.id), 0) + 1,
            date: goalData.date,
            amount: parseFloat(goalData.amount),
            category: goalData.category,
            currentAmount: parseFloat(goalData.currentAmount) || 0,
            progress: 0
        };
        
        newGoal.progress = this.calculateProgress(newGoal.currentAmount, newGoal.amount);
        this.goals.push(newGoal);
        this.saveGoalsToStorage();
        return newGoal;
    }

    // Actualizar meta existente
    updateGoal(goalId, updatedData) {
        const index = this.goals.findIndex(g => g.id === goalId);
        if (index === -1) return null;

        this.goals[index] = {
            ...this.goals[index],
            date: updatedData.date,
            amount: parseFloat(updatedData.amount),
            category: updatedData.category,
            currentAmount: parseFloat(updatedData.currentAmount) || 0
        };

        this.goals[index].progress = this.calculateProgress(
            this.goals[index].currentAmount, 
            this.goals[index].amount
        );

        this.saveGoalsToStorage();
        return this.goals[index];
    }

    // Eliminar meta
    deleteGoal(goalId) {
        const initialLength = this.goals.length;
        this.goals = this.goals.filter(g => g.id !== goalId);
        
        if (this.goals.length < initialLength) {
            this.saveGoalsToStorage();
            return true;
        }
        return false;
    }

    // Calcular progreso
    calculateProgress(current, target) {
        return Math.min(Math.round((current / target) * 100), 100);
    }

    // Formatear moneda
    formatCurrency(amount) {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(amount);
    }

    // Formatear fecha
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-CO', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit'
        });
    }

    // Calcular tiempo restante
    calculateRemainingTime(deadline) {
        const now = new Date();
        const target = new Date(deadline);
        const diffTime = target - now;
        const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
        
        if (diffMonths <= 0) return 'Vencida';
        if (diffMonths === 1) return '1 mes restante';
        return `${diffMonths} meses restantes`;
    }
}

// Crear instancia global
window.sharedGoals = new SharedGoalsManager();

// ============================================================
// FUNCIONES ESPECÃFICAS PARA GESTIÃ“N DE METAS (gestion_metas.html)
// ============================================================

function initGoalsManagement() {
    // Solo ejecutar si estamos en la pÃ¡gina de gestiÃ³n de metas
    if (!document.getElementById('goalsList')) return;

    renderGoalsList();
    setupGoalsFormHandlers();
    setupGoalsEventListeners();
}

function renderGoalsList() {
    const goalsList = document.getElementById('goalsList');
    if (!goalsList) return;

    const goals = window.sharedGoals.getAllGoals();
    
    if (goals.length === 0) {
        goalsList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-bullseye"></i>
                <h3>No hay metas registradas</h3>
                <p>Agrega tu primera meta financiera para comenzar</p>
            </div>
        `;
        return;
    }

    goalsList.innerHTML = goals.map(goal => `
        <div class="goal-item">
            <div class="goal-content">
                <div class="goal-date">${window.sharedGoals.formatDate(goal.date)}</div>
                <div class="goal-amount">${window.sharedGoals.formatCurrency(goal.amount)}</div>
                <div class="goal-category">${goal.category}</div>
                <div class="goal-progress-container">
                    <div class="goal-progress-text">
                        ${window.sharedGoals.formatCurrency(goal.currentAmount)} / ${window.sharedGoals.formatCurrency(goal.amount)}
                    </div>
                    <div class="goal-progress-bar">
                        <div class="goal-progress-fill" style="width: ${goal.progress}%"></div>
                        <div class="goal-progress-percentage">${goal.progress}%</div>
                    </div>
                </div>
            </div>
            <div class="goal-actions">
                <button class="btn-action btn-edit" onclick="editGoal(${goal.id})">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="btn-action btn-delete" onclick="deleteGoal(${goal.id})">
                    <i class="fas fa-trash"></i> Eliminar
                </button>
            </div>
        </div>
    `).join('');
}

function setupGoalsFormHandlers() {
    const goalForm = document.getElementById('goalForm');
    if (!goalForm) return;

    goalForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = {
            date: document.getElementById('goalDate').value,
            amount: document.getElementById('goalAmount').value,
            category: document.getElementById('goalCategory').value,
            currentAmount: document.getElementById('goalCurrentAmount').value
        };
        
        if (window.editingGoalId) {
            // Actualizar meta existente
            window.sharedGoals.updateGoal(window.editingGoalId, formData);
            window.editingGoalId = null;
        } else {
            // Agregar nueva meta
            window.sharedGoals.addGoal(formData);
        }
        
        renderGoalsList();
        closeModal();
        showNotification('Meta guardada exitosamente');
    });
}

function setupGoalsEventListeners() {
    // Escuchar cambios en las metas para actualizar la vista
    window.addEventListener('goalsUpdated', function(event) {
        renderGoalsList();
    });
}

function editGoal(goalId) {
    const goals = window.sharedGoals.getAllGoals();
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;

    // Llenar formulario con datos existentes
    document.getElementById('goalDate').value = goal.date;
    document.getElementById('goalAmount').value = goal.amount;
    document.getElementById('goalCategory').value = goal.category;
    document.getElementById('goalCurrentAmount').value = goal.currentAmount;

    window.editingGoalId = goalId;
    document.getElementById('modalTitle').textContent = 'Editar Meta';
    document.getElementById('goalModal').style.display = 'block';
}

function deleteGoal(goalId) {
    if (confirm('Â¿EstÃ¡s seguro de que deseas eliminar esta meta?')) {
        if (window.sharedGoals.deleteGoal(goalId)) {
            renderGoalsList();
            showNotification('Meta eliminada exitosamente');
        }
    }
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed; top: 20px; right: 20px; z-index: 1000;
        background: #8cc08cff; color: #000000; padding: 15px 20px;
        border-radius: 8px; border: 2px solid #000;
        font-weight: 600; box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        transform: translateX(100%); transition: transform 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

// ============================================================
// FUNCIONES ESPECÃFICAS PARA PERFIL (perfilU.html)
// ============================================================

function initProfileGoals() {
    // Solo ejecutar si estamos en la pÃ¡gina de perfil
    if (!document.querySelector('.goals-list')) return;

    renderProfileGoals();
    setupProfileEventListeners();
}

function renderProfileGoals() {
    const goalsContainer = document.querySelector('.goals-list');
    if (!goalsContainer) return;

    const goals = window.sharedGoals.getAllGoals();

    if (goals.length === 0) {
        goalsContainer.innerHTML = `
            <div class="goal-item" style="text-align: center; padding: 30px;">
                <div style="color: #112e54; font-size: 1.1rem;">
                    <i class="fas fa-bullseye" style="font-size: 2rem; margin-bottom: 10px; display: block; opacity: 0.7;"></i>
                    No tienes metas registradas
                </div>
            </div>
        `;
        return;
    }

    // Mostrar solo las primeras 3 metas para el perfil
    const displayGoals = goals.slice(0, 3);
    
    goalsContainer.innerHTML = displayGoals.map(goal => {
        const remainingTime = window.sharedGoals.calculateRemainingTime(goal.date);
        
        return `
            <div class="goal-item">
                <div class="goal-header">
                    <span class="goal-name">${goal.category}</span>
                    <span class="goal-percentage">${goal.progress}%</span>
                </div>
                <div class="goal-progress">
                    <div class="goal-progress-fill" style="width: ${goal.progress}%"></div>
                </div>
                <div class="goal-details">
                    <span>${window.sharedGoals.formatCurrency(goal.currentAmount)} / ${window.sharedGoals.formatCurrency(goal.amount)}</span>
                    <span>${remainingTime}</span>
                </div>
            </div>
        `;
    }).join('');
}

function setupProfileEventListeners() {
    // Actualizar metas del perfil cuando cambien en gestiÃ³n
    window.addEventListener('goalsUpdated', function(event) {
        renderProfileGoals();
    });

    // Actualizar el botÃ³n "Gestionar Meta" para redirigir a la pÃ¡gina de gestiÃ³n
    const manageBtn = document.querySelector('.card-action[href="gestion_metas.html"]');
    if (manageBtn) {
        manageBtn.textContent = 'Gestionar Metas';
        manageBtn.onclick = function(e) {
            e.preventDefault();
            window.location.href = 'gestion_metas.html';
        };
    }
}

// ============================================================
// INICIALIZACIÃ“N AUTOMÃTICA
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar segÃºn la pÃ¡gina actual
    if (document.getElementById('goalsList')) {
        // Estamos en gestion_metas.html
        initGoalsManagement();
    } else if (document.querySelector('.goals-list')) {
        // Estamos en perfilU.html
        initProfileGoals();
    }
});

// Actualizar datos cuando la pÃ¡gina se vuelve visible (cambio de pestaÃ±a)
document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        // Recargar metas cuando la pÃ¡gina se vuelve visible
        if (document.getElementById('goalsList')) {
            renderGoalsList();
        } else if (document.querySelector('.goals-list')) {
            renderProfileGoals();
        }
    }
});