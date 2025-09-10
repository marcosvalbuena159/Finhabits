// perfil.js - Sistema completo de gestión financiera

// ============================================================
// SISTEMA DE GESTIÓN DE METAS COMPARTIDO
// ============================================================

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
        return [];
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

// ============================================================
// SISTEMA DE GESTIÓN DE INGRESOS Y GASTOS COMPARTIDO
// ============================================================

class SharedIncomeExpensesManager {
    constructor() {
        this.storageKey = 'finhabits_income_expenses';
        this.transactions = this.loadTransactionsFromStorage();
    }

    // Cargar transacciones desde almacenamiento del navegador
    loadTransactionsFromStorage() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                return JSON.parse(stored);
            }
        } catch (e) {
            console.error('Error loading transactions from storage:', e);
        }
        
        return [];
    }

    // Guardar transacciones en almacenamiento del navegador
    saveTransactionsToStorage() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.transactions));
            // Disparar evento personalizado para notificar cambios
            window.dispatchEvent(new CustomEvent('transactionsUpdated', { 
                detail: { transactions: this.transactions } 
            }));
        } catch (e) {
            console.error('Error saving transactions to storage:', e);
        }
    }

    // Obtener todas las transacciones
    getAllTransactions() {
        return [...this.transactions];
    }

    // Agregar nueva transacción
    addTransaction(transactionData) {
        const newTransaction = {
            id: Math.max(...this.transactions.map(t => t.id), 0) + 1,
            type: transactionData.type, // 'income' o 'expense'
            amount: parseFloat(transactionData.amount),
            category: transactionData.category,
            date: new Date().toISOString().split('T')[0], // Fecha actual
            timestamp: new Date().getTime()
        };
        
        this.transactions.push(newTransaction);
        this.saveTransactionsToStorage();
        return newTransaction;
    }

    // Calcular totales
    calculateTotals() {
        let totalIncome = 0;
        let totalExpenses = 0;

        this.transactions.forEach(transaction => {
            if (transaction.type === 'income') {
                totalIncome += transaction.amount;
            } else if (transaction.type === 'expense') {
                totalExpenses += transaction.amount;
            }
        });

        return {
            totalIncome,
            totalExpenses,
            balance: totalIncome - totalExpenses
        };
    }

    // Calcular totales del mes actual
    calculateMonthlyTotals() {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();
        
        let monthlyIncome = 0;
        let monthlyExpenses = 0;

        this.transactions.forEach(transaction => {
            const transactionDate = new Date(transaction.date);
            if (transactionDate.getMonth() === currentMonth && 
                transactionDate.getFullYear() === currentYear) {
                
                if (transaction.type === 'income') {
                    monthlyIncome += transaction.amount;
                } else if (transaction.type === 'expense') {
                    monthlyExpenses += transaction.amount;
                }
            }
        });

        return {
            monthlyIncome,
            monthlyExpenses,
            monthlyBalance: monthlyIncome - monthlyExpenses
        };
    }

    // Formatear moneda
    formatCurrency(amount) {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(amount);
    }

    // Obtener transacciones recientes (últimas 10)
    getRecentTransactions(limit = 10) {
        return this.transactions
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, limit);
    }

    // Eliminar transacción
    deleteTransaction(transactionId) {
        const initialLength = this.transactions.length;
        this.transactions = this.transactions.filter(t => t.id !== transactionId);
        
        if (this.transactions.length < initialLength) {
            this.saveTransactionsToStorage();
            return true;
        }
        return false;
    }
}

// Crear instancias globales
window.sharedGoals = new SharedGoalsManager();
window.sharedIncomeExpenses = new SharedIncomeExpensesManager();

// ============================================================
// FUNCIONES ESPECÍFICAS PARA GESTIÓN DE METAS (gestion_metas.html)
// ============================================================

function initGoalsManagement() {
    // Solo ejecutar si estamos en la página de gestión de metas
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
    if (confirm('¿Estás seguro de que deseas eliminar esta meta?')) {
        if (window.sharedGoals.deleteGoal(goalId)) {
            renderGoalsList();
            showNotification('Meta eliminada exitosamente');
        }
    }
}

// ============================================================
// FUNCIONES ESPECÍFICAS PARA REGISTRO DE INGRESOS Y GASTOS (ingreso_gasto.html)
// ============================================================

function initIncomeExpensesForms() {
    // Solo ejecutar si estamos en la página de registro
    if (!document.querySelector('.registro-section')) return;

    setupIncomeForm();
    setupExpenseForm();
}

function setupIncomeForm() {
    const incomeForm = document.querySelector('.ingresos-card .registro-form');
    if (!incomeForm) return;

    incomeForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const amount = parseFloat(incomeForm.querySelector('input[type="number"]').value);
        const category = incomeForm.querySelector('select').value;
        
        if (!amount || !category) {
            showNotification('Por favor completa todos los campos', 'error');
            return;
        }

        const transactionData = {
            type: 'income',
            amount: amount,
            category: category
        };
        
        window.sharedIncomeExpenses.addTransaction(transactionData);
        incomeForm.reset();
        showNotification('Ingreso registrado exitosamente', 'success');
    });
}

function setupExpenseForm() {
    const expenseForm = document.querySelector('.gastos-card .registro-form');
    if (!expenseForm) return;

    expenseForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const amount = parseFloat(expenseForm.querySelector('input[type="number"]').value);
        const category = expenseForm.querySelector('select').value;
        
        if (!amount || !category) {
            showNotification('Por favor completa todos los campos', 'error');
            return;
        }

        const transactionData = {
            type: 'expense',
            amount: amount,
            category: category
        };
        
        window.sharedIncomeExpenses.addTransaction(transactionData);
        expenseForm.reset();
        showNotification('Gasto registrado exitosamente', 'success');
    });
}

// ============================================================
// FUNCIONES ESPECÍFICAS PARA PERFIL (perfilU.html)
// ============================================================

function initProfileGoals() {
    // Solo ejecutar si estamos en la página de perfil
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

function initProfileIncomeExpenses() {
    // Solo ejecutar si estamos en la página de perfil
    if (!document.querySelector('.investment-grid')) return;

    renderProfileFinancialData();
    setupProfileIncomeExpensesEventListeners();
}

function renderProfileFinancialData() {
    const totals = window.sharedIncomeExpenses.calculateTotals();
    const monthlyTotals = window.sharedIncomeExpenses.calculateMonthlyTotals();
    
    // Actualizar Balance Diario
    updateDailyBalance(totals);
    
    // Actualizar Balance General
    updateGeneralBalance(totals, monthlyTotals);
}

function updateDailyBalance(totals) {
    const investmentGrid = document.querySelector('.investment-grid');
    if (!investmentGrid) return;

    // Buscar y actualizar los elementos existentes
    const items = investmentGrid.querySelectorAll('.investment-item');
    
    items.forEach(item => {
        const name = item.querySelector('.investment-name').textContent;
        const valueElement = item.querySelector('.investment-value');
        
        switch(name) {
            case 'Ingresos':
                valueElement.textContent = window.sharedIncomeExpenses.formatCurrency(totals.totalIncome);
                break;
            case 'Gatos': // Mantener el typo original del HTML
                valueElement.textContent = window.sharedIncomeExpenses.formatCurrency(totals.totalExpenses);
                break;
        }
    });
}

function updateGeneralBalance(totals, monthlyTotals) {
    const balanceGrid = document.querySelector('.balance-grid');
    if (!balanceGrid) return;

    const items = balanceGrid.querySelectorAll('.balance-item');
    
    items.forEach(item => {
        const label = item.querySelector('.balance-label').textContent;
        const valueElement = item.querySelector('.balance-value');
        const changeElement = item.querySelector('.balance-change');
        
        switch(label) {
            case 'Total Disponible':
                valueElement.textContent = window.sharedIncomeExpenses.formatCurrency(Math.max(totals.balance, 0));
                const balanceChange = monthlyTotals.monthlyBalance;
                if (balanceChange >= 0) {
                    changeElement.textContent = `+${window.sharedIncomeExpenses.formatCurrency(balanceChange)} este mes`;
                    changeElement.className = 'balance-change positive';
                } else {
                    changeElement.textContent = `${window.sharedIncomeExpenses.formatCurrency(balanceChange)} este mes`;
                    changeElement.className = 'balance-change negative';
                }
                break;
        }
    });
}

function setupProfileEventListeners() {
    // Actualizar metas del perfil cuando cambien en gestión
    window.addEventListener('goalsUpdated', function(event) {
        renderProfileGoals();
    });

    // Actualizar el botón "Gestionar Meta" para redirigir a la página de gestión
    const manageBtn = document.querySelector('.card-action[href="gestion_metas.html"]');
    if (manageBtn) {
        manageBtn.textContent = 'Gestionar Metas';
        manageBtn.onclick = function(e) {
            e.preventDefault();
            window.location.href = 'gestion_metas.html';
        };
    }
}

function setupProfileIncomeExpensesEventListeners() {
    // Actualizar datos del perfil cuando cambien las transacciones
    window.addEventListener('transactionsUpdated', function(event) {
        renderProfileFinancialData();
    });
}

// ============================================================
// FUNCIONES UTILITARIAS COMPARTIDAS
// ============================================================

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    const backgroundColor = type === 'success' ? '#d4edda' : '#f8d7da';
    const textColor = type === 'success' ? '#155724' : '#721c24';
    
    notification.style.cssText = `
        position: fixed; top: 20px; right: 20px; z-index: 1000;
        background: ${backgroundColor}; color: ${textColor}; padding: 15px 20px;
        border-radius: 8px; border: 2px solid #000;
        font-weight: 600; box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        transform: translateX(100%); transition: transform 0.3s ease;
        max-width: 300px;
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

function openModal(mode, goalId = null) {
    const modal = document.getElementById('goalModal');
    const modalTitle = document.getElementById('modalTitle');
    const form = document.getElementById('goalForm');
    
    if (mode === 'add') {
        modalTitle.textContent = 'Agregar Meta';
        form.reset();
        editingGoalId = null;
    } else if (mode === 'edit') {
        modalTitle.textContent = 'Editar Meta';
        editingGoalId = goalId;
        const goal = window.sharedGoals.getAllGoals().find(g => g.id === goalId);
        if (goal) {
            document.getElementById('goalDate').value = goal.date;
            document.getElementById('goalAmount').value = goal.amount;
            document.getElementById('goalCategory').value = goal.category;
            document.getElementById('goalCurrentAmount').value = goal.currentAmount;
        }
    }
    
    modal.style.display = 'block';
}

function closeModal() {
    const modal = document.getElementById('goalModal');
    if (modal) {
        modal.style.display = 'none';
        window.editingGoalId = null;
    }
}

// ============================================================
// INICIALIZACIÓN AUTOMÁTICA
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar según la página actual
    if (document.getElementById('goalsList')) {
        // Estamos en gestion_metas.html
        initGoalsManagement();
    } else if (document.querySelector('.registro-section')) {
        // Estamos en ingreso_gasto.html
        initIncomeExpensesForms();
    } else if (document.querySelector('.goals-list')) {
        // Estamos en perfilU.html
        initProfileGoals();
        initProfileIncomeExpenses();
    }
});

// Cerrar modal al hacer clic fuera de él
window.onclick = function(event) {
    const modal = document.getElementById('goalModal');
    if (event.target === modal) {
        closeModal();
    }
}

// Actualizar datos cuando la página se vuelve visible (cambio de pestaña)
document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        // Recargar datos cuando la página se vuelve visible
        if (document.getElementById('goalsList')) {
            renderGoalsList();
        } else if (document.querySelector('.goals-list')) {
            renderProfileGoals();
            renderProfileFinancialData();
        }
    }
});