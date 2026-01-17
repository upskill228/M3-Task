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
    const titleSpan = document.createElement("span");
    titleSpan.textContent = task.title;
    const categorySpan = document.createElement("span");
    categorySpan.textContent = task.category;
    categorySpan.classList.add("category");
    const infoDiv = document.createElement("div");
    infoDiv.classList.add("info");
    infoDiv.appendChild(titleSpan);
    infoDiv.appendChild(categorySpan);
    li.appendChild(infoDiv);
    if (task.completed && task.conclusionDate) {
        const dataStr = task.conclusionDate.toLocaleString("pt-PT", {
            day: "2-digit",
            month: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        });
        const dataP = document.createElement("p");
        dataP.textContent = `Task completed on: ${dataStr}`;
        dataP.classList.add("conclusionDate");
        li.appendChild(dataP);
        li.classList.add("completed");
    }
    li.appendChild(addDeleteButton(task));
    li.appendChild(addEditButton(task));
    li.appendChild(addCheckmarkButton(task));
    return li;
}
//Function Render
function renderTasks(tasks = taskList) {
    taskListUl.innerHTML = "";
    tasks.forEach(task => {
        taskListUl.appendChild(addLiTask(task));
    });
    countPendingTasks();
}
;
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
    const filtered = taskList.filter(task => task.title.toLowerCase().includes(term));
    renderTasks(filtered);
});
// Init
renderTasks();
export {};
//# sourceMappingURL=main.js.map