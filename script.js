class TodoApp {
    constructor() {
        this.todos = JSON.parse(localStorage.getItem('todos')) || [];
        this.currentFilter = 'all';
        this.nextId = this.todos.length > 0 ? Math.max(...this.todos.map(t => t.id)) + 1 : 1;
        
        this.initializeElements();
        this.bindEvents();
        this.render();
    }
    
    initializeElements() {
        this.todoInput = document.getElementById('todoInput');
        this.addBtn = document.getElementById('addBtn');
        this.todoList = document.getElementById('todoList');
        this.taskCount = document.getElementById('taskCount');
        this.clearCompletedBtn = document.getElementById('clearCompleted');
        this.filterBtns = document.querySelectorAll('.filter-btn');
    }
    
    bindEvents() {
        // Add todo events
        this.addBtn.addEventListener('click', () => this.addTodo());
        this.todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTodo();
        });
        
        // Filter events
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setFilter(e.target.dataset.filter);
            });
        });
        
        // Clear completed event
        this.clearCompletedBtn.addEventListener('click', () => this.clearCompleted());
        
        // Todo list events (using event delegation)
        this.todoList.addEventListener('click', (e) => {
            const todoItem = e.target.closest('.todo-item');
            if (!todoItem) return;
            
            const todoId = parseInt(todoItem.dataset.id);
            
            if (e.target.classList.contains('todo-checkbox')) {
                this.toggleTodo(todoId);
            } else if (e.target.classList.contains('delete-btn')) {
                this.deleteTodo(todoId);
            }
        });
    }
    
    addTodo() {
        const text = this.todoInput.value.trim();
        if (!text) return;
        
        const newTodo = {
            id: this.nextId++,
            text: text,
            completed: false,
            createdAt: new Date().toISOString()
        };
        
        this.todos.unshift(newTodo);
        this.todoInput.value = '';
        this.saveTodos();
        this.render();
        
        // Add a subtle animation effect
        setTimeout(() => {
            const newItem = this.todoList.querySelector(`[data-id="${newTodo.id}"]`);
            if (newItem) {
                newItem.style.transform = 'translateX(-20px)';
                newItem.style.opacity = '0';
                setTimeout(() => {
                    newItem.style.transition = 'all 0.3s ease';
                    newItem.style.transform = 'translateX(0)';
                    newItem.style.opacity = '1';
                }, 10);
            }
        }, 10);
    }
    
    toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.saveTodos();
            this.render();
        }
    }
    
    deleteTodo(id) {
        const todoElement = this.todoList.querySelector(`[data-id="${id}"]`);
        if (todoElement) {
            todoElement.style.transition = 'all 0.3s ease';
            todoElement.style.transform = 'translateX(100%)';
            todoElement.style.opacity = '0';
            
            setTimeout(() => {
                this.todos = this.todos.filter(t => t.id !== id);
                this.saveTodos();
                this.render();
            }, 300);
        }
    }
    
    clearCompleted() {
        const completedItems = this.todoList.querySelectorAll('.todo-item.completed');
        
        completedItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.transition = 'all 0.2s ease';
                item.style.transform = 'translateX(100%)';
                item.style.opacity = '0';
            }, index * 50);
        });
        
        setTimeout(() => {
            this.todos = this.todos.filter(t => !t.completed);
            this.saveTodos();
            this.render();
        }, completedItems.length * 50 + 200);
    }
    
    setFilter(filter) {
        this.currentFilter = filter;
        
        // Update active filter button
        this.filterBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });
        
        this.render();
    }
    
    getFilteredTodos() {
        switch (this.currentFilter) {
            case 'active':
                return this.todos.filter(t => !t.completed);
            case 'completed':
                return this.todos.filter(t => t.completed);
            default:
                return this.todos;
        }
    }
    
    render() {
        const filteredTodos = this.getFilteredTodos();
        
        if (filteredTodos.length === 0) {
            this.renderEmptyState();
        } else {
            this.renderTodos(filteredTodos);
        }
        
        this.updateStats();
    }
    
    renderEmptyState() {
        const emptyMessages = {
            all: { title: "No tasks yet!", message: "Add a task above to get started." },
            active: { title: "No active tasks!", message: "All tasks are completed. Great job!" },
            completed: { title: "No completed tasks!", message: "Complete some tasks to see them here." }
        };
        
        const message = emptyMessages[this.currentFilter];
        
        this.todoList.innerHTML = `
            <div class="empty-state">
                <h3>${message.title}</h3>
                <p>${message.message}</p>
            </div>
        `;
    }
    
    renderTodos(todos) {
        this.todoList.innerHTML = todos.map(todo => `
            <li class="todo-item ${todo.completed ? 'completed' : ''}" data-id="${todo.id}">
                <div class="todo-checkbox ${todo.completed ? 'checked' : ''}"></div>
                <span class="todo-text">${this.escapeHtml(todo.text)}</span>
                <button class="delete-btn">×</button>
            </li>
        `).join('');
    }
    
    updateStats() {
        const activeTodos = this.todos.filter(t => !t.completed);
        const count = activeTodos.length;
        const completedCount = this.todos.length - count;
        
        this.taskCount.textContent = `${count} task${count !== 1 ? 's' : ''} remaining`;
        
        // Show/hide clear completed button
        this.clearCompletedBtn.style.display = completedCount > 0 ? 'block' : 'none';
    }
    
    saveTodos() {
        localStorage.setItem('todos', JSON.stringify(this.todos));
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TodoApp();
});

// Add some keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + / to focus input
    if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        document.getElementById('todoInput').focus();
    }
    
    // Escape to clear input
    if (e.key === 'Escape') {
        const input = document.getElementById('todoInput');
        if (document.activeElement === input) {
            input.value = '';
            input.blur();
        }
    }
});