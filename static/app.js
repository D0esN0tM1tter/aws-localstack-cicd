// API Base URL - adjust if your Flask app runs on a different port
const API_BASE_URL = 'http://localhost:5000';

// DOM Elements
const todoForm = document.getElementById('todoForm');
const todosList = document.getElementById('todosList');
const refreshBtn = document.getElementById('refreshBtn');
const messageDiv = document.getElementById('message');

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    loadTodos();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    todoForm.addEventListener('submit', handleAddTodo);
    refreshBtn.addEventListener('click', loadTodos);
}

// Handle form submission
async function handleAddTodo(e) {
    e.preventDefault();
    
    const formData = new FormData(todoForm);
    const todoData = {
        title: formData.get('title'),
        description: formData.get('description'),
        priority: formData.get('priority'),
        completed: false,
        created_at: new Date().toISOString()
    };

    try {
        const response = await fetch(`${API_BASE_URL}/todos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(todoData)
        });

        if (response.ok) {
            const result = await response.json();
            showMessage('Todo added successfully!', 'success');
            todoForm.reset();
            loadTodos(); // Refresh the list
        } else {
            throw new Error('Failed to add todo');
        }
    } catch (error) {
        console.error('Error adding todo:', error);
        showMessage('Error adding todo. Please try again.', 'error');
    }
}

// Load and display todos
async function loadTodos() {
    try {
        showLoading();
        
        const response = await fetch(`${API_BASE_URL}/todos`);
        
        if (response.ok) {
            const todos = await response.json();
            displayTodos(todos);
        } else {
            throw new Error('Failed to load todos');
        }
    } catch (error) {
        console.error('Error loading todos:', error);
        showMessage('Error loading todos. Please check if the API is running.', 'error');
        todosList.innerHTML = '<div class="loading">Failed to load todos. Please try again.</div>';
    }
}

// Display todos in the UI
function displayTodos(todos) {
    if (todos.length === 0) {
        todosList.innerHTML = `
            <div class="empty-state">
                <h3>No todos yet!</h3>
                <p>Add your first todo using the form above.</p>
            </div>
        `;
        return;
    }

    const todosHTML = todos.map((todo, index) => {
        const todoId = index + 1; // Simple ID based on position
        return `
            <div class="todo-item">
                <div class="todo-title">${escapeHtml(todo.title || 'Untitled')}</div>
                <div class="todo-description">${escapeHtml(todo.description || 'No description')}</div>
                <div class="todo-meta">
                    <span class="todo-priority priority-${todo.priority || 'medium'}">${todo.priority || 'medium'} priority</span>
                    <span class="todo-id">ID: ${todoId}</span>
                </div>
            </div>
        `;
    }).join('');

    todosList.innerHTML = todosHTML;
}

// Show loading state
function showLoading() {
    todosList.innerHTML = '<div class="loading">Loading todos...</div>';
}

// Show success/error messages
function showMessage(text, type = 'success') {
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;
    messageDiv.classList.add('show');

    // Hide message after 3 seconds
    setTimeout(() => {
        messageDiv.classList.remove('show');
    }, 3000);
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

// Auto-refresh todos every 30 seconds
setInterval(loadTodos, 30000);