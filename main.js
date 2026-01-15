var listaComTarefas = document.querySelector("ul");
var form = document.querySelector(".taskForm");
var input = document.querySelector("input");
;
var TarefaClass = /** @class */ (function () {
    function TarefaClass(id, titulo) {
        this.id = id;
        this.titulo = titulo;
        this.concluida = false;
    }
    TarefaClass.prototype.markDone = function () {
        this.concluida = true;
    };
    return TarefaClass;
}());
;
var listaTarefas = [];
var tarefa1 = new TarefaClass(1, "Terminar os exercícios guiados da aula 2");
var tarefa2 = new TarefaClass(2, "Comerçar os exercícios autónomos da aula 2");
var tarefa3 = new TarefaClass(3, "Terminar os exercícios autónomos da aula 2");
// Delete Button
function addDeleteButton(tarefa) {
    var btn = document.createElement("button");
    btn.textContent = "Delete";
    btn.addEventListener("click", function (event) {
        event.stopPropagation(); // Evita marcar como concluída
        var index = listaTarefas.findIndex(function (t) { return t.id === tarefa.id; });
        if (index !== -1) {
            listaTarefas.splice(index, 1); // Remove a tarefa do array
        }
        renderTasks(); // Atualiza a lista no DOM
    });
    return btn;
}
// Edit Button
function addEditButton(tarefa) {
}
// Create li with input.value,
// mark as done,
// add delete button and edit button
function addLiTask(tarefa) {
    var li = document.createElement("li");
    li.textContent = tarefa.titulo;
    li.addEventListener("click", function () {
        tarefa.markDone();
        renderTasks();
    });
    li.appendChild(addDeleteButton(tarefa));
    return li;
}
;
function renderTasks() {
    listaComTarefas.innerHTML = "";
    listaTarefas.forEach(function (tarefa) {
        var li = addLiTask(tarefa);
        listaComTarefas.appendChild(li);
    });
}
listaTarefas.push(tarefa1, tarefa2, tarefa3);
renderTasks();
form.addEventListener("submit", function (event) {
    event.preventDefault();
    var novaTarefa = new TarefaClass(Date.now(), input.value);
    listaTarefas.push(novaTarefa);
    renderTasks();
    input.value = "";
});
