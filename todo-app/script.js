// TODO App JavaScript

let todos = [];
let currentFilter = 'all';
let editingId = null;

// Sample data to populate the app
const sampleTodos = [
    { id: 1, text: "Complete the project proposal", completed: false, createdAt: new Date('2024-01-15') },
    { id: 2, text: "Buy groceries for the week", completed: true, createdAt: new Date('2024-01-14') },
    { id: 3, text: "Schedule dentist appointment", completed: false, createdAt: new Date('2024-01-13') },
    { id: 4, text: "Read 20 pages of 'The Great Gatsby'", completed: true, createdAt: new Date('2024-01-12') },
    { id: 5, text: "Organize desk and workspace", completed: false, createdAt: new Date('2024-01-11') },
    { id: 6, text: "Call mom and dad", completed: false, createdAt: new Date('2024-01-10') },
    { id: 7, text: "Update resume and LinkedIn profile", completed: false, createdAt: new Date('2024-01-09') },
    { id: 8, text: "Plan weekend hiking trip", completed: true, createdAt: new Date('2024-01-08') }
];

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    loadTodos();
    renderTodos();
    updateStats();
    
    // Add event listener for Enter key in input
    document.getElementById('todoInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTodo();
        }
    });
    
    // Add event listener for Enter key in edit modal
    document.getElementById('editInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            saveEdit();
        }
    });
    
    // Close modal when clicking outside
    document.getElementById('editModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeEditModal();
        }
    });
});

// Load todos from localStorage or use sample data
function loadTodos() {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
        todos = JSON.parse(savedTodos).map(todo => ({
            ...todo,
            createdAt: new Date(todo.createdAt)
        }));
    } else {
        todos = [...sampleTodos];
        saveTodos();
    }
}

// Save todos to localStorage
function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

// Generate unique ID
function generateId() {
    return Date.now() + Math.random();
}

// Add new todo
function addTodo() {
    const input = document.getElementById('todoInput');
    const text = input.value.trim();
    
    if (text === '') {
        alert('Please enter a task!');
        return;
    }
    
    const newTodo = {
        id: generateId(),
        text: text,
        completed: false,
        createdAt: new Date()
    };
    
    todos.unshift(newTodo); // Add to beginning of array
    input.value = '';
    
    saveTodos();
    renderTodos();
    updateStats();
    
    // Add a subtle animation effect
    setTimeout(() => {
        const firstItem = document.querySelector('.todo-item');
        if (firstItem) {
            firstItem.style.backgroundColor = '#e3f2fd';
            setTimeout(() => {
                firstItem.style.backgroundColor = '';
            }, 1000);
        }
    }, 100);
}

// Toggle todo completion
function toggleTodo(id) {
    todos = todos.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    
    saveTodos();
    renderTodos();
    updateStats();
}

// Delete todo
function deleteTodo(id) {
    if (confirm('Are you sure you want to delete this task?')) {
        todos = todos.filter(todo => todo.id !== id);
        saveTodos();
        renderTodos();
        updateStats();
    }
}

// Open edit modal
function editTodo(id) {
    const todo = todos.find(todo => todo.id === id);
    if (todo) {
        editingId = id;
        document.getElementById('editInput').value = todo.text;
        document.getElementById('editModal').style.display = 'block';
        document.getElementById('editInput').focus();
        document.getElementById('editInput').select();
    }
}

// Close edit modal
function closeEditModal() {
    document.getElementById('editModal').style.display = 'none';
    editingId = null;
}

// Save edited todo
function saveEdit() {
    const newText = document.getElementById('editInput').value.trim();
    
    if (newText === '') {
        alert('Please enter a task!');
        return;
    }
    
    todos = todos.map(todo => 
        todo.id === editingId ? { ...todo, text: newText } : todo
    );
    
    saveTodos();
    renderTodos();
    closeEditModal();
}

// Filter todos
function filterTodos(filter) {
    currentFilter = filter;
    
    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    renderTodos();
}

// Get filtered todos
function getFilteredTodos() {
    switch (currentFilter) {
        case 'active':
            return todos.filter(todo => !todo.completed);
        case 'completed':
            return todos.filter(todo => todo.completed);
        default:
            return todos;
    }
}

// Clear completed todos
function clearCompleted() {
    const completedCount = todos.filter(todo => todo.completed).length;
    
    if (completedCount === 0) {
        alert('No completed tasks to clear!');
        return;
    }
    
    if (confirm(`Are you sure you want to delete ${completedCount} completed task(s)?`)) {
        todos = todos.filter(todo => !todo.completed);
        saveTodos();
        renderTodos();
        updateStats();
    }
}

// Render todos
function renderTodos() {
    const todoList = document.getElementById('todoList');
    const filteredTodos = getFilteredTodos();
    
    if (filteredTodos.length === 0) {
        todoList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-clipboard-list"></i>
                <h3>No tasks found</h3>
                <p>${getEmptyStateMessage()}</p>
            </div>
        `;
        return;
    }
    
    todoList.innerHTML = filteredTodos.map(todo => `
        <li class="todo-item ${todo.completed ? 'completed' : ''}">
            <input 
                type="checkbox" 
                class="todo-checkbox" 
                ${todo.completed ? 'checked' : ''} 
                onchange="toggleTodo(${todo.id})"
            >
            <span class="todo-text">${escapeHtml(todo.text)}</span>
            <div class="todo-actions">
                <button class="edit-btn" onclick="editTodo(${todo.id})" title="Edit task">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="delete-btn" onclick="deleteTodo(${todo.id})" title="Delete task">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </li>
    `).join('');
}

// Get empty state message based on current filter
function getEmptyStateMessage() {
    switch (currentFilter) {
        case 'active':
            return 'All tasks are completed! Great job! 🎉';
        case 'completed':
            return 'No completed tasks yet. Start checking off some tasks!';
        default:
            return 'No tasks yet. Add your first task above!';
    }
}

// Update statistics
function updateStats() {
    const totalTasks = todos.length;
    const completedTasks = todos.filter(todo => todo.completed).length;
    const activeTasks = totalTasks - completedTasks;
    
    document.getElementById('totalTasks').textContent = totalTasks;
    document.getElementById('completedTasks').textContent = completedTasks;
    document.getElementById('activeTasks').textContent = activeTasks;
    
    // Update clear completed button visibility
    const clearBtn = document.getElementById('clearCompleted');
    clearBtn.style.display = completedTasks > 0 ? 'block' : 'none';
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Export/Import functionality (bonus features)
function exportTodos() {
    const dataStr = JSON.stringify(todos, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'todos-backup.json';
    link.click();
    URL.revokeObjectURL(url);
}

function importTodos(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedTodos = JSON.parse(e.target.result);
            if (confirm('This will replace all current todos. Continue?')) {
                todos = importedTodos.map(todo => ({
                    ...todo,
                    createdAt: new Date(todo.createdAt)
                }));
                saveTodos();
                renderTodos();
                updateStats();
                alert('Todos imported successfully!');
            }
        } catch (error) {
            alert('Error importing todos. Please check the file format.');
        }
    };
    reader.readAsText(file);
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + Enter to add todo
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        document.getElementById('todoInput').focus();
    }
    
    // Escape to close modal
    if (e.key === 'Escape') {
        closeEditModal();
    }
});

// Add some utility functions for better UX
function showNotification(message, type = 'info') {
    // Simple notification system (can be enhanced)
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
        color: white;
        border-radius: 5px;
        z-index: 1001;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Auto-save indicator
let saveTimeout;
function showSaveIndicator() {
    clearTimeout(saveTimeout);
    const indicator = document.getElementById('saveIndicator') || createSaveIndicator();
    indicator.style.opacity = '1';
    
    saveTimeout = setTimeout(() => {
        indicator.style.opacity = '0';
    }, 1000);
}

function createSaveIndicator() {
    const indicator = document.createElement('div');
    indicator.id = 'saveIndicator';
    indicator.innerHTML = '<i class="fas fa-check"></i> Saved';
    indicator.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 10px 15px;
        background: #28a745;
        color: white;
        border-radius: 20px;
        font-size: 14px;
        opacity: 0;
        transition: opacity 0.3s ease;
        z-index: 1000;
    `;
    document.body.appendChild(indicator);
    return indicator;
}