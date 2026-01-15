// HTML / DOM
var listaComTarefas = document.querySelector("ul");
var form = document.querySelector(".taskForm");
var input = document.querySelector("input");
var countTasks = document.querySelector("#countPendingTasks");
//Class
var TarefaClass = /** @class */ (function () {
    function TarefaClass(id, titulo) {
        this.id = id;
        this.titulo = titulo;
        this.concluida = false;
    }
    TarefaClass.prototype.toggleConcluida = function () {
        this.concluida = !this.concluida;
        if (this.concluida) {
            this.dataConclusao = new Date();
        }
        else {
            this.dataConclusao = undefined;
        }
    };
    TarefaClass.prototype.editarTitulo = function (novoTitulo) {
        var tituloLimpo = novoTitulo.trim();
        if (tituloLimpo === "")
            return;
        this.titulo = tituloLimpo;
    };
    return TarefaClass;
}());
//Array
var listaTarefas = [
    new TarefaClass(1, "Terminar os exercícios guiados da aula 2"),
    new TarefaClass(2, "Começar os exercícios autónomos da aula 2"),
    new TarefaClass(3, "Terminar os exercícios autónomos da aula 2"),
];
// Botões
// Delete Button
function addDeleteButton(tarefa) {
    var btnDelete = document.createElement("button");
    btnDelete.innerHTML = "<i class=\"fa-solid fa-trash-can\"></i>";
    btnDelete.addEventListener("click", function (event) {
        event.stopPropagation();
        listaTarefas = listaTarefas.filter(function (t) { return t.id !== tarefa.id; });
        renderTasks();
    });
    return btnDelete;
}
// Edit Button
function addEditButton(tarefa) {
    var btnEdit = document.createElement("button");
    btnEdit.innerHTML = "<i class=\"fa-solid fa-pencil\"></i>";
    btnEdit.addEventListener("click", function (event) {
        event.stopPropagation();
        var novoTitulo = prompt("Editar tarefa:", tarefa.titulo);
        if (novoTitulo && novoTitulo.trim() !== "") {
            tarefa.editarTitulo(novoTitulo);
            renderTasks();
        }
    });
    return btnEdit;
}
// Checkmark button
function addCheckmarkButton(tarefa) {
    var btnCheck = document.createElement("button");
    var updateIcon = function () {
        btnCheck.innerHTML = tarefa.concluida
            ? "<i class=\"fa-regular fa-square\"></i>"
            : "<i class=\"fa-solid fa-check-square\"></i>";
    };
    updateIcon(); // ícone inicial
    btnCheck.addEventListener("click", function (event) {
        event.stopPropagation();
        tarefa.toggleConcluida();
        renderTasks();
    });
    return btnCheck;
}
// Create li and append buttons
function addLiTask(tarefa) {
    var li = document.createElement("li");
    if (tarefa.concluida && tarefa.dataConclusao) {
        var dataStr = tarefa.dataConclusao.toLocaleString("pt-PT", {
            day: "2-digit",
            month: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        });
        li.textContent = "".concat(tarefa.titulo, " - Conclu\u00EDda em: ").concat(dataStr);
        li.classList.add("concluida");
    }
    else {
        li.textContent = tarefa.titulo;
    }
    li.appendChild(addDeleteButton(tarefa));
    li.appendChild(addEditButton(tarefa));
    li.appendChild(addCheckmarkButton(tarefa));
    return li;
}
//Function Render
function renderTasks() {
    listaComTarefas.innerHTML = "";
    listaTarefas.forEach(function (tarefa) {
        var li = addLiTask(tarefa);
        listaComTarefas.appendChild(li);
    });
    countPendingTasks();
}
//Form
form.addEventListener("submit", function (event) {
    event.preventDefault();
    var valor = input.value.trim();
    if (valor === "")
        return;
    var novaTarefa = new TarefaClass(Date.now(), valor);
    listaTarefas.push(novaTarefa);
    renderTasks();
    input.value = "";
});
// Count Pending Tasks
function countPendingTasks() {
    var count = listaTarefas.filter(function (tarefa) { return !tarefa.concluida; }).length;
    countTasks.textContent = "Pendentes: ".concat(count);
}
// Init
renderTasks();
