// Wait for the page to load
document.addEventListener('DOMContentLoaded', () => {
    // Get all the elements we need
    const taskInput = document.querySelector('.task-input');
    const categorySelect = document.querySelector('.category-selector');
    const taskList = document.querySelector('.task-list');
    const addButton = document.getElementById('add-task');
    const settingsBtn = document.getElementById('settings-btn');
    const settingsModal = document.querySelector('.settings-modal');

    // Handle adding new tasks
    addButton.addEventListener('click', () => {
        let taskText = taskInput.value.trim();
        
        // Don't add empty tasks
        if (!taskText) {
            taskInput.placeholder = 'Please enter a task!';
            taskInput.classList.add('shake');  // Add some feedback
            setTimeout(() => {
                taskInput.classList.remove('shake');
                taskInput.placeholder = "What's on your task list?";
            }, 1000);
            return;
        }

        // Create new task
        const taskDiv = document.createElement('div');
        taskDiv.className = 'task';
        
        // Set the task content
        taskDiv.innerHTML = `
            <span class="task-category ${categorySelect.value}"></span>
            <span class="task-text">${taskText}</span>
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
        `;

        // Add to list and clear input
        taskList.appendChild(taskDiv);
        taskInput.value = '';

        // Save to localStorage (optional)
        saveTasks();
    });

    // Also add task when Enter is pressed
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addButton.click();
        }
    });

    // Handle editing and deleting tasks
    taskList.addEventListener('click', (e) => {
        const clickedButton = e.target;
        const taskDiv = clickedButton.parentElement;

        // Delete task
        if (clickedButton.classList.contains('delete-btn')) {
            // Add fade-out animation
            taskDiv.style.opacity = '0';
            taskDiv.style.transform = 'translateX(20px)';
            setTimeout(() => {
                taskDiv.remove();
                saveTasks();
            }, 300);
        }

        // Edit task
        if (clickedButton.classList.contains('edit-btn')) {
            const taskText = taskDiv.querySelector('.task-text');
            const currentText = taskText.textContent;
            
            // Create a temporary input field
            const input = document.createElement('input');
            input.type = 'text';
            input.value = currentText;
            input.className = 'edit-input';

            // Replace text with input
            taskText.replaceWith(input);
            input.focus();

            // Handle saving the edit
            const saveEdit = () => {
                const newText = input.value.trim();
                if (newText) {
                    const newSpan = document.createElement('span');
                    newSpan.className = 'task-text';
                    newSpan.textContent = newText;
                    input.replaceWith(newSpan);
                    saveTasks();
                }
            };

            // Save on Enter or when clicking away
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    saveEdit();
                }
            });
            input.addEventListener('blur', saveEdit);
        }
    });

    // Settings modal functionality
    settingsBtn.addEventListener('click', () => {
        settingsModal.classList.toggle('hidden');
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (!settingsModal.classList.contains('hidden') && 
            !settingsModal.contains(e.target) && 
            e.target !== settingsBtn) {
            settingsModal.classList.add('hidden');
        }
    });

    // Handle theme changes
    const colorButtons = document.querySelectorAll('.color-btn');
    colorButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const color = btn.getAttribute('data-color');
            document.body.style.backgroundColor = color;
            
            // Save preference
            localStorage.setItem('preferred-theme', color);
            
            // Hide modal
            settingsModal.classList.add('hidden');
        });
    });

    // Optional: Save tasks to localStorage
    function saveTasks() {
        const tasks = [];
        document.querySelectorAll('.task').forEach(task => {
            tasks.push({
                text: task.querySelector('.task-text').textContent,
                category: task.querySelector('.task-category').classList[1]
            });
        });
        localStorage.setItem('saved-tasks', JSON.stringify(tasks));
    }

    // Optional: Load saved tasks
    function loadSavedTasks() {
        const savedTasks = localStorage.getItem('saved-tasks');
        const savedTheme = localStorage.getItem('preferred-theme');

        if (savedTheme) {
            document.body.style.backgroundColor = savedTheme;
        }

        if (savedTasks) {
            const tasks = JSON.parse(savedTasks);
            tasks.forEach(task => {
                const taskDiv = document.createElement('div');
                taskDiv.className = 'task';
                taskDiv.innerHTML = `
                    <span class="task-category ${task.category}"></span>
                    <span class="task-text">${task.text}</span>
                    <button class="edit-btn">Edit</button>
                    <button class="delete-btn">Delete</button>
                `;
                taskList.appendChild(taskDiv);
            });
        }
    }

    // Load saved data when page loads
    loadSavedTasks();
});