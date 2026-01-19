// ELEMENTS
const taskListUl = document.querySelector("#taskListUl") as HTMLUListElement;
const form = document.querySelector(".taskForm") as HTMLFormElement;
const input = document.querySelector("#inputTask") as HTMLInputElement;
const selectCategory = document.querySelector("#category") as HTMLSelectElement;
const taskFormError = document.querySelector("#taskFormError") as HTMLParagraphElement;

const countPendingTasks = document.querySelector("#countPendingTasks") as HTMLDivElement;
const searchInput = document.querySelector("#searchTask") as HTMLInputElement;

const btnShowPending = document.querySelector("#btnShowPending") as HTMLButtonElement;
const btnShowCompleted = document.querySelector("#btnShowCompleted") as HTMLButtonElement;
const btnOrder = document.querySelector("#btnOrder") as HTMLButtonElement;
const btnClearCompleted = document.querySelector("#btnClearCompleted") as HTMLButtonElement;

// TYPES & INTERFACE
type Category = 'Work' | 'Personal' | 'Study';
type FilterType = "all" | "pending" | "completed";

interface Task {
    id: number;
    title: string;
    completed: boolean;
    category: Category;
    conclusionDate?: Date;

    toggleCompleted(): void;
    editTitle(newTitle: string): void;
}

// CLASS
class TaskClass implements Task {
    id: number;
    title: string;
    completed: boolean;
    category: Category;
    conclusionDate?: Date;

    constructor(id: number, title: string, category: Category) {
        this.id = id;
        this.title = title;
        this.completed = false;
        this.category = category;
    }

    toggleCompleted(): void {
        this.completed = !this.completed;
        if (this.completed) this.conclusionDate = new Date();
        else delete this.conclusionDate;
    }

    editTitle(newTitle: string): void {
        const t = newTitle.trim();
        if (t) this.title = t;
    }
}

// ARRAY
let taskList: Task[] = [
    new TaskClass (1, "This is my first made-up task", "Study"),
    new TaskClass (2, "Mock task number 2", "Work"),
    new TaskClass (3, "This is a mock task and a half", "Work"),
];

// STATE
let nextId = taskList.length > 0 ? Math.max(...taskList.map(t => t.id)) + 1 : 1;
let currentFilter: FilterType = "all";
let searchTerm = "";
let isOrderedAZ = false;

// BUTTONS - FUNCTIONS
function getVisibleTasks(): Task[] {
    let tasks = taskList.filter(task => {
        if (currentFilter === "pending" && task.completed) return false;
        if (currentFilter === "completed" && !task.completed) return false;
        if (searchTerm && !task.title.toLowerCase().includes(searchTerm.toLowerCase())) return false;
        return true;
    });

    if (isOrderedAZ) {
        tasks = [...tasks].sort((a, b) => a.title.localeCompare(b.title));
    }

    return tasks;
}

function updateButtonsText(): void {
    btnShowPending.textContent = currentFilter === "pending" ? "Show All" : "Pending";
    btnShowCompleted.textContent = currentFilter === "completed" ? "Show All" : "Completed";
    btnOrder.textContent = isOrderedAZ ? "Original Order" : "Order A-Z";
}

// FUNCTIONS
function addTaskButtons(task: Task): HTMLDivElement {
    const container = document.createElement("div");
    container.classList.add("task-actions");

    const checkBtn = document.createElement("button");
    checkBtn.innerHTML = task.completed ? `<i class="fa-solid fa-check-square"></i>` : `<i class="fa-regular fa-square"></i>`;
    checkBtn.addEventListener("click", () => {
        task.toggleCompleted();
        updateUI();
    });

    const editBtn = document.createElement("button");
    editBtn.innerHTML = `<i class="fa-solid fa-pencil"></i>`;
    editBtn.addEventListener("click", () => {
        const newTitle = prompt("Edit task:", task.title);
        if (newTitle) task.editTitle(newTitle);
        updateUI();
    });

    const delBtn = document.createElement("button");
    delBtn.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
    delBtn.addEventListener("click", () => {
        if (confirm(`Remove task "${task.title}"?`)) {
            taskList = taskList.filter(t => t.id !== task.id);
            updateUI();
        }
    });

    container.append(checkBtn, editBtn, delBtn);
    return container;
}

function createTaskLi(task: Task): HTMLLIElement {
    const li = document.createElement("li");
    li.className = `task-item ${task.category.toLowerCase()} ${task.completed ? "completed" : ""}`;

    // Highlight new task
    if (task.id === nextId - 1) { // última adicionada
        li.classList.add("new-task");
        setTimeout(() => li.classList.remove("new-task"), 1000);
    }

    const header = document.createElement("div");
    header.classList.add("task-header");

    const title = document.createElement("h3");
    title.textContent = task.title;
    title.classList.add("task-title");

    const meta = document.createElement("div");
    meta.classList.add("task-meta");
    meta.textContent = task.category;
    if (task.completed && task.conclusionDate) {
        meta.textContent += ` — Completed: ${task.conclusionDate.toLocaleString("pt-PT", { day:"2-digit", month:"2-digit", hour:"2-digit", minute:"2-digit" })}`;
    }

    header.append(title);
    li.append(header, meta, addTaskButtons(task));
    return li;
}

// RENDER
function renderTasks(tasks: Task[] = taskList): void {
    taskListUl.innerHTML = "";
    if (!tasks.length) {
        const li = document.createElement("li");
        li.textContent = searchTerm 
            ? `No tasks match "${searchTerm}"` 
            : "No tasks available";
        li.classList.add("no-tasks");
        taskListUl.appendChild(li);
        return;
    }
    tasks.forEach(task => taskListUl.appendChild(createTaskLi(task)));
    countPendingTasksFunc();
}

// COUNT PENDING TASKS
function countPendingTasksFunc(): void {
    const pending = taskList.filter(t => !t.completed).length;
    countPendingTasks.textContent = `Pending Tasks: ${pending}`;
}

// EVENT LISTENERS
// Form
form.addEventListener("submit", e => {
    e.preventDefault();
    taskFormError.textContent = "";

    const title = input.value.trim();
    const category = selectCategory.value as Category;
    const titleRegex = /[a-zA-Z]{3,}/;

    if (!titleRegex.test(title)) {
        taskFormError.textContent = "The task title must contain at least 3 letters.";
        return;
    }

    if (!category) {
        taskFormError.textContent = "Please select a category.";
        return;
    }

    const newTask = new TaskClass(nextId++, title, category);
    taskList.push(newTask);

    input.value = "";
    selectCategory.value = "";
    updateUI();
});

// Filter
btnShowPending.addEventListener("click", () => {
    currentFilter = currentFilter === "pending" ? "all" : "pending";
    searchTerm = "";
    searchInput.value = "";
    updateUI();
});
btnShowCompleted.addEventListener("click", () => {
    currentFilter = currentFilter === "completed" ? "all" : "completed";
    searchTerm = "";
    searchInput.value = "";
    updateUI();
});

// Order
btnOrder.addEventListener("click", () => {
    isOrderedAZ = !isOrderedAZ;
    updateUI();
});

// Clear completed
btnClearCompleted.addEventListener("click", () => {
    if (confirm("Remove all completed tasks?")) {
        taskList = taskList.filter(t => !t.completed);
        updateUI();
    }
});

// Search
searchInput.addEventListener("input", () => {
    searchTerm = searchInput.value.trim();
    updateUI();
});

// FINAL FUNCTION
function updateUI(): void {
    renderTasks(getVisibleTasks());
    updateButtonsText();
    countPendingTasksFunc();
}

// INITIAL RENDER
updateUI();
