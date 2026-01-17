// HTML / DOM
let taskListUl = document.querySelector("#taskListUl");
let form = document.querySelector(".taskForm");
let input = document.querySelector("#inputTask");
let countTasks = document.querySelector("#countPendingTasks");
let btnOrder = document.querySelector("#btnOrder");
let selectCategory = document.querySelector("#category");
let btnRemoveCompleted = document.querySelector("#btnRemoveCompleted");
//Class
class TaskClass {
    constructor(id, title, category) {
        this.id = id;
        this.title = title;
        this.completed = false;
        this.category = category;
    }
    toggleCompleted() {
        this.completed = !this.completed;
        if (this.completed) {
            this.conclusionDate = new Date();
        }
        else {
            delete this.conclusionDate;
        }
    }
    editTitle(newtitle) {
        const titleTrim = newtitle.trim();
        if (titleTrim === "")
            return;
        this.title = titleTrim;
    }
}
//Array
let taskList = [
    new TaskClass(1, "This is my first made-up task", "Study"),
    new TaskClass(2, "Mock task number 2", "Work"),
    new TaskClass(3, "This is a mock task and a half", "Work"),
];
// Delete Button
function addDeleteButton(task) {
    const btnDelete = document.createElement("button");
    btnDelete.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
    btnDelete.addEventListener("click", () => {
        taskList = taskList.filter(t => t.id !== task.id);
        renderTasks();
    });
    return btnDelete;
}
// Edit Button
function addEditButton(task) {
    const btnEdit = document.createElement("button");
    btnEdit.innerHTML = `<i class="fa-solid fa-pencil"></i>`;
    btnEdit.addEventListener("click", () => {
        const newtitle = prompt("Edit task:", task.title);
        if (newtitle && newtitle.trim() !== "") {
            task.editTitle(newtitle);
            renderTasks();
        }
    });
    return btnEdit;
}
// Checkmark button
function addCheckmarkButton(task) {
    const btnCheck = document.createElement("button");
    const updateIcon = () => {
        btnCheck.innerHTML = task.completed
            ? `<i class="fa-regular fa-square"></i>`
            : `<i class="fa-solid fa-check-square"></i>`;
    };
    updateIcon(); // Initial Icon
    btnCheck.addEventListener("click", () => {
        task.toggleCompleted();
        renderTasks();
    });
    return btnCheck;
}
// Create li and append buttons
function addLiTask(task) {
    const li = document.createElement("li");
    li.classList.add("task-item", task.category.toLowerCase());
    if (task.completed) {
        li.classList.add("completed");
    }
    /* HEADER */
    const header = document.createElement("div");
    header.classList.add("task-header");
    const title = document.createElement("h3");
    title.classList.add("task-title");
    title.textContent = task.title;
    const checkBtn = addCheckmarkButton(task);
    header.append(checkBtn, title);
    /* META INFO */
    const meta = document.createElement("div");
    meta.classList.add("task-meta");
    const categorySpan = document.createElement("span");
    categorySpan.classList.add("category");
    categorySpan.textContent = task.category;
    meta.appendChild(categorySpan);
    if (task.completed && task.conclusionDate) {
        const dateSpan = document.createElement("span");
        dateSpan.classList.add("conclusionDate");
        dateSpan.textContent = `Completed on: ${task.conclusionDate.toLocaleString("pt-PT", {
            day: "2-digit",
            month: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        })}`;
        meta.appendChild(dateSpan);
    }
    /* ACTIONS */
    const actions = document.createElement("div");
    actions.classList.add("task-actions");
    actions.append(addEditButton(task), addDeleteButton(task));
    /* ASSEMBLY */
    li.append(header, meta, actions);
    return li;
}
//Function Render
function renderTasks(tasks = taskList) {
    taskListUl.innerHTML = "";
    if (tasks.length === 0) {
        const li = document.createElement("li");
        li.textContent = "No tasks found";
        li.classList.add("no-tasks");
        taskListUl.appendChild(li);
        return;
    }
    tasks.forEach(task => {
        taskListUl.appendChild(addLiTask(task));
    });
    countPendingTasks();
}
;
// function renderTasks(tasks: Task[] = taskList): void {
//     taskListUl.innerHTML = "";
//     tasks.forEach(task => {
//          taskListUl.appendChild(addLiTask(task));
//     });
//     countPendingTasks();
// };
//Form
form.addEventListener("submit", (event) => {
    event.preventDefault();
    const valor = input.value.trim();
    if (valor === "")
        return;
    const category = selectCategory.value;
    const newTask = new TaskClass(Date.now(), valor, category);
    taskList.push(newTask);
    renderTasks();
    input.value = "";
});
// Count Pending Tasks
function countPendingTasks() {
    const count = taskList.filter(task => !task.completed).length;
    countTasks.textContent = `Pending Tasks: ${count}`;
}
// Order A-Z button
btnOrder.addEventListener("click", () => {
    taskList.sort((a, b) => a.title.localeCompare(b.title));
    renderTasks();
});
// Remove Completed Tasks
btnRemoveCompleted.addEventListener("click", () => {
    taskList = taskList.filter(task => !task.completed);
    renderTasks();
});
// Search Bar
const searchInput = document.querySelector("#searchTask");
searchInput.addEventListener("input", () => {
    const term = searchInput.value.toLowerCase();
    const filtered = taskList.filter(task => { var _a; return (_a = task.title) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes(term); });
    renderTasks(filtered);
});
// Init
renderTasks();
