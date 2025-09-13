let goals = [

];

let editingGoalId = null;

function formatCurrency(amount) {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
    }).format(amount);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CO', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit'
    });
}

function calculateProgress(current, target) {
    return Math.min(Math.round((current / target) * 100), 100);
}

function renderGoals() {
    const goalsList = document.getElementById('goalsList');

    if (goals.length === 0) {
        goalsList.innerHTML = `
                    <div class="empty-state">
                        <i class="fa-solid fa-money-bill-transfer"></i>
                        <h3>No hay trasacciones registradas</h3>
                        <p>Agrega tu primera Trasaccion para comenzar</p>
                    </div>
                `;
        return;
    }

    goalsList.innerHTML = goals.map(goal => `
                <div class="goal-item">
                    <div class="goal-content">
                        <div class="goal-date">${formatDate(goal.date)}</div>
                        <div class="goal-amount">${formatCurrency(goal.amount)}</div>
                        <div class="goal-category">${goal.category}</div>
                        <div class="goal-progress-container">
                            <div class="goal-progress-text">
                                ${formatCurrency(goal.currentAmount)} / ${formatCurrency(goal.amount)}
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

function openModal(mode, goalId = null) {
    const modal = document.getElementById('goalModal');
    const modalTitle = document.getElementById('modalTitle');
    const form = document.getElementById('goalForm');

    if (mode === 'add') {
        modalTitle.textContent = 'Agregar Trasaccion';
        form.reset();
        editingGoalId = null;
    } else if (mode === 'edit') {
        modalTitle.textContent = 'Editar Trasaccion';
        editingGoalId = goalId;
        const goal = goals.find(g => g.id === goalId);
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
    document.getElementById('goalModal').style.display = 'none';
    editingGoalId = null;
}

function editGoal(goalId) {
    openModal('edit', goalId);
}

function deleteGoal(goalId) {
    if (confirm('¿Estás seguro de que deseas eliminar esta Trasaccion?')) {
        goals = goals.filter(goal => goal.id !== goalId);
        renderGoals();
    }
}

// Form submission
document.getElementById('goalForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const date = document.getElementById('goalDate').value;
    const amount = parseFloat(document.getElementById('goalAmount').value);
    const category = document.getElementById('goalCategory').value;
    const currentAmount = parseFloat(document.getElementById('goalCurrentAmount').value) || 0;
    const progress = calculateProgress(currentAmount, amount);

    if (editingGoalId) {
        // Edit existing goal
        const goalIndex = goals.findIndex(g => g.id === editingGoalId);
        if (goalIndex !== -1) {
            goals[goalIndex] = {
                ...goals[goalIndex],
                date,
                amount,
                category,
                currentAmount,
                progress
            };
        }
    } else {
        // Add new goal
        const newGoal = {
            id: Math.max(...goals.map(g => g.id), 0) + 1,
            date,
            amount,
            category,
            currentAmount,
            progress
        };
        goals.push(newGoal);
    }

    renderGoals();
    closeModal();
});

// Close modal when clicking outside
window.onclick = function (event) {
    const modal = document.getElementById('goalModal');
    if (event.target === modal) {
        closeModal();
    }
}

// Initialize
renderGoals();