// HTML / DOM
var listaComTarefas = document.querySelector("#listaComTarefas");
var form = document.querySelector(".taskForm");
var input = document.querySelector("input");
var countTasks = document.querySelector("#countPendingTasks");
var btnOrder = document.querySelector("#btnOrder");
var selectCategoria = document.querySelector("#categoria");
//Class
var TarefaClass = /** @class */ (function () {
    function TarefaClass(id, titulo, categoria) {
        this.id = id;
        this.titulo = titulo;
        this.concluida = false;
        this.categoria = categoria;
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
    new TarefaClass(1, "Terminar os exercícios guiados da aula 2", "Estudo"),
    new TarefaClass(2, "Começar os exercícios autónomos da aula 2", "Estudo"),
    new TarefaClass(3, "Terminar os exercícios autónomos da aula 2", "Estudo"),
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
    updateIcon(); // Initial Icon
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
    li.classList.add("tarefa", tarefa.categoria.toLowerCase());
    /* --- TÍTULO --- */
    var tituloSpan = document.createElement("span");
    tituloSpan.textContent = tarefa.titulo;
    li.appendChild(tituloSpan);
    /* --- CATEGORIA --- */
    var categoriaSpan = document.createElement("span");
    categoriaSpan.textContent = tarefa.categoria;
    categoriaSpan.classList.add("categoria");
    li.appendChild(categoriaSpan);
    /* --- DATA DE CONCLUSÃO --- */
    if (tarefa.concluida && tarefa.dataConclusao) {
        var dataStr = tarefa.dataConclusao.toLocaleString("pt-PT", {
            day: "2-digit",
            month: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        });
        var dataP = document.createElement("p");
        dataP.textContent = "Conclu\u00EDda em: ".concat(dataStr);
        dataP.classList.add("dataConclusao");
        li.appendChild(dataP);
        li.classList.add("concluida");
    }
    /* --- BOTÕES --- */
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
    var categoria = selectCategoria.value;
    var novaTarefa = new TarefaClass(Date.now(), valor, categoria);
    listaTarefas.push(novaTarefa);
    renderTasks();
    input.value = "";
});
// Count Pending Tasks
function countPendingTasks() {
    var count = listaTarefas.filter(function (tarefa) { return !tarefa.concluida; }).length;
    countTasks.textContent = "Pendentes: ".concat(count);
}
// Order button
btnOrder.addEventListener("click", function (event) {
    event.stopPropagation();
    listaTarefas.sort(function (a, b) { return a.titulo.localeCompare(b.titulo); });
    renderTasks();
});
// Init
renderTasks();
