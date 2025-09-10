// shared-income-expenses.js - Sistema de gestión de ingresos y gastos compartido entre páginas

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
        
        // Datos iniciales de ejemplo si no hay nada guardado
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

// Crear instancia global
window.sharedIncomeExpenses = new SharedIncomeExpensesManager();

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

function setupProfileIncomeExpensesEventListeners() {
    // Actualizar datos del perfil cuando cambien las transacciones
    window.addEventListener('transactionsUpdated', function(event) {
        renderProfileFinancialData();
    });
}

// ============================================================
// FUNCIONES UTILITARIAS
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

// ============================================================
// INICIALIZACIÓN AUTOMÁTICA
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar según la página actual
    if (document.querySelector('.registro-section')) {
        // Estamos en ingreso_gasto.html
        initIncomeExpensesForms();
    } else if (document.querySelector('.investment-grid')) {
        // Estamos en perfilU.html
        initProfileIncomeExpenses();
    }
});

// Actualizar datos cuando la página se vuelve visible (cambio de pestaña)
document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        // Recargar datos cuando la página se vuelve visible
        if (document.querySelector('.investment-grid')) {
            renderProfileFinancialData();
        }
    }
});