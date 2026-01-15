let listaComTarefas = document.querySelector("ul") as HTMLUListElement;
let form = document.querySelector(".taskForm") as HTMLFormElement;
let input = document.querySelector("input") as HTMLInputElement;

interface Tarefa {
    id: number;
    titulo: string;
    concluida: boolean;
};

class TarefaClass implements Tarefa {
    id: number;
    titulo: string;
    concluida: boolean;

    constructor (id: number, titulo: string) {
        this.id = id;
        this.titulo = titulo;
        this.concluida = false;
    }

    markDone(): void {
        this.concluida = true;
    }
};

let listaTarefas: Tarefa[] = [];

let tarefa1 = new TarefaClass (1, "Terminar os exercícios guiados da aula 2");
let tarefa2 = new TarefaClass (2, "Comerçar os exercícios autónomos da aula 2");
let tarefa3 = new TarefaClass (3, "Terminar os exercícios autónomos da aula 2");

// Delete Button
function addDeleteButton(tarefa: TarefaClass): HTMLButtonElement {
    const btn = document.createElement("button");
    btn.textContent = "Delete";

    btn.addEventListener("click", (event) => {
        event.stopPropagation(); // Evita marcar como concluída

        const index = listaTarefas.findIndex(t => t.id === tarefa.id);
        if (index !== -1) {
            listaTarefas.splice(index, 1); // Remove a tarefa do array
        }

        renderTasks(); // Atualiza a lista no DOM
    });

    return btn;
}

// Edit Button
function addEditButton(tarefa: TarefaClass): HTMLButtonElement {

}

// Create li with input.value,
// mark as done,
// add delete button and edit button

function addLiTask (tarefa: TarefaClass): HTMLLIElement {
    const li = document.createElement("li");
    li.textContent = tarefa.titulo;

    li.addEventListener("click", () => {
        tarefa.markDone();
        renderTasks();
    });
    li.appendChild(addDeleteButton(tarefa));
    return li;
};

function renderTasks(): void {
    listaComTarefas.innerHTML = "";

    listaTarefas.forEach((tarefa) => {
        const li = addLiTask(tarefa);
        listaComTarefas.appendChild(li);
    });
}

listaTarefas.push(tarefa1, tarefa2, tarefa3);
renderTasks();

form.addEventListener("submit", (event) => {
    event.preventDefault();

    const novaTarefa = new TarefaClass(Date.now(), input.value);
    listaTarefas.push(novaTarefa);

    renderTasks();
    input.value = "";
});
