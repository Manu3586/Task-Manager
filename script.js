var tasks = [];

var newTaskInput = document.getElementById('new-task-input');
var addTaskBtn = document.getElementById('add-task-btn');
var taskList = document.getElementById('task-list');
var loadingIndicator = document.getElementById('loading-indicator');
var statusMessage = document.getElementById('status-message');
var clearCompletedBtn = document.getElementById('clear-completed-btn');
var clearContainer = document.getElementById('clear-container');
var messageBox = document.getElementById('message-box');
var messageText = document.getElementById('message-text');
var closeMessageBtn = document.getElementById('close-message-btn');
var progressBar = document.getElementById('progress-bar');

function showMessageBox(text) {
    messageText.textContent = text;
    messageBox.classList.remove('hidden');
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks() {
    taskList.innerHTML = '';
    
    var incompleteTasks = [];
    var completedTasks = [];
    
    for (var i = 0; i < tasks.length; i++) {
        var task = tasks[i];
        if (task.completed === false) {
            incompleteTasks.push(task);
        } else {
            completedTasks.push(task);
        }
    }
    
    if (incompleteTasks.length === 0 && completedTasks.length === 0) {
        statusMessage.textContent = "No tasks yet!";
    } else {
        statusMessage.textContent = incompleteTasks.length + " tasks remaining";
    }

    var totalCount = incompleteTasks.length + completedTasks.length;
    var completedCount = completedTasks.length;
    var progress = 0;
    if (totalCount > 0) {
        progress = (completedCount / totalCount) * 100;
    }
    
    progressBar.style.width = progress + "%";
    progressBar.style.background = 'linear-gradient(90deg, #f368e0, #8d70fe)';

    if (progress === 100) {
        progressBar.classList.add('animate-pulse');
    } else {
        progressBar.classList.remove('animate-pulse');
    }

    if (completedTasks.length > 0) {
        clearContainer.classList.remove('hidden');
    } else {
        clearContainer.classList.add('hidden');
    }

    for (var j = 0; j < incompleteTasks.length; j++) {
        var task = incompleteTasks[j];
        var li = document.createElement('li');
        li.dataset.id = task.id;
        li.className = "task-item flex items-center justify-between p-4 rounded-xl shadow-sm transition duration-200 ease-in-out transform hover:scale-[1.01] bg-white";
        li.innerHTML = `
            <span class="flex-grow font-medium text-gray-800">${task.text}</span>
            <div class="flex items-center space-x-2">
                <button class="toggle-btn text-purple-500 hover:text-purple-700 transition duration-200" title="Mark as complete">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </button>
                <button class="delete-btn text-red-500 hover:text-red-700 transition duration-200" title="Delete task">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </div>
        `;
        taskList.appendChild(li);
    }
}

function addTask() {
    var text = newTaskInput.value.trim();
    if (text === '') {
        showMessageBox("Please enter a task.");
        return;
    }
    
    var newTask = {
        id: new Date().getTime(),
        text: text,
        completed: false
    };
    
    tasks.push(newTask);
    saveTasks();
    renderTasks();
    newTaskInput.value = '';
}

function toggleCompletion(taskId) {
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id == taskId) {
            tasks[i].completed = !tasks[i].completed;
            break;
        }
    }
    saveTasks();
    renderTasks();
}

function deleteTask(taskId) {
    tasks = tasks.filter(function(task) {
        return task.id != taskId;
    });
    saveTasks();
    renderTasks();
}

function clearCompletedTasks() {
    tasks = tasks.filter(function(task) {
        return task.completed === false;
    });
    saveTasks();
    renderTasks();
}

addTaskBtn.addEventListener('click', addTask);
newTaskInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addTask();
    }
});

taskList.addEventListener('click', function(e) {
    var li = e.target.closest('li');
    if (!li) return;
    var taskId = li.dataset.id;
    
    if (e.target.closest('.toggle-btn')) {
        toggleCompletion(taskId);
    }

    if (e.target.closest('.delete-btn')) {
        deleteTask(taskId);
    }
});

clearCompletedBtn.addEventListener('click', clearCompletedTasks);

closeMessageBtn.addEventListener('click', function() {
    messageBox.classList.add('hidden');
});

function init() {
    loadingIndicator.classList.remove('hidden');
    var storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
    }
    renderTasks();
    loadingIndicator.classList.add('hidden');
}

init();
