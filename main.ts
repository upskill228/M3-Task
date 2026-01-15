// HTML / DOM
let listaComTarefas = document.querySelector("ul") as HTMLUListElement;
let form = document.querySelector(".taskForm") as HTMLFormElement;
let input = document.querySelector("input") as HTMLInputElement;
let countTasks = document.querySelector("#countPendingTasks") as HTMLDivElement;

//Interface
interface Tarefa {
    id: number;
    titulo: string;
    concluida: boolean;
    dataConclusao?: Date;

    editarTitulo(novoTitulo: string): void;
    toggleConcluida(): void;
}

//Class
class TarefaClass implements Tarefa {
    id: number;
    titulo: string;
    concluida: boolean;
    dataConclusao?: Date;

    constructor(id: number, titulo: string) {
        this.id = id;
        this.titulo = titulo;
        this.concluida = false;
    }

    toggleConcluida(): void {
        this.concluida = !this.concluida;
        if (this.concluida) {
            this.dataConclusao = new Date();
        } else {
            this.dataConclusao = undefined;
        }
    }

    editarTitulo(novoTitulo: string): void {
        const tituloLimpo = novoTitulo.trim();
        if (tituloLimpo === "") return;
        this.titulo = tituloLimpo;
    }
}

//Array
let listaTarefas: Tarefa[] = [
    new TarefaClass (1, "Terminar os exercícios guiados da aula 2"),
    new TarefaClass (2, "Começar os exercícios autónomos da aula 2"),
    new TarefaClass (3, "Terminar os exercícios autónomos da aula 2"),
];

// Botões

// Delete Button
function addDeleteButton(tarefa: Tarefa): HTMLButtonElement {
    const btnDelete = document.createElement("button");
    btnDelete.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
    btnDelete.addEventListener("click", (event) => {
        event.stopPropagation();
        listaTarefas = listaTarefas.filter(t => t.id !== tarefa.id);
        renderTasks();
    });
    return btnDelete;
}

// Edit Button
function addEditButton(tarefa: Tarefa): HTMLButtonElement {
    const btnEdit = document.createElement("button");
    btnEdit.innerHTML = `<i class="fa-solid fa-pencil"></i>`;
    btnEdit.addEventListener("click", (event) => {
        event.stopPropagation();
        const novoTitulo = prompt("Editar tarefa:", tarefa.titulo);
        if (novoTitulo && novoTitulo.trim() !== "") {
            tarefa.editarTitulo(novoTitulo);
            renderTasks();
        }
    });
    return btnEdit;
}

// Checkmark button
function addCheckmarkButton(tarefa: Tarefa): HTMLButtonElement {
    const btnCheck = document.createElement("button");

    const updateIcon = () => {
        btnCheck.innerHTML = tarefa.concluida
            ? `<i class="fa-regular fa-square"></i>`
            : `<i class="fa-solid fa-check-square"></i>`;
    };

    updateIcon(); // ícone inicial

    btnCheck.addEventListener("click", (event) => {
        event.stopPropagation();
        (tarefa as TarefaClass).toggleConcluida();
        renderTasks();
    });

    return btnCheck;
}

// Create li and append buttons

function addLiTask(tarefa: Tarefa): HTMLLIElement {
    const li = document.createElement("li");

    if (tarefa.concluida && tarefa.dataConclusao) {
        const dataStr = tarefa.dataConclusao.toLocaleString("pt-PT", {
            day: "2-digit",
            month: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        });
        li.textContent = `${tarefa.titulo} - Concluída em: ${dataStr}`;
        li.classList.add("concluida");
    } else {
        li.textContent = tarefa.titulo;
    }

    li.appendChild(addDeleteButton(tarefa));
    li.appendChild(addEditButton(tarefa));
    li.appendChild(addCheckmarkButton(tarefa));

    return li;
}

//Function Render
function renderTasks(): void {
    listaComTarefas.innerHTML = "";
    listaTarefas.forEach((tarefa) => {
        const li = addLiTask(tarefa);
        listaComTarefas.appendChild(li);
    });
    countPendingTasks();
}

//Form
form.addEventListener("submit", (event) => {
    event.preventDefault();
    const valor = input.value.trim();
    if (valor === "") return;

    const novaTarefa = new TarefaClass(Date.now(), valor);
    listaTarefas.push(novaTarefa);

    renderTasks();
    input.value = "";
});

// Count Pending Tasks
function countPendingTasks(): void {
    const count = listaTarefas.filter(tarefa => !tarefa.concluida).length;
    countTasks.textContent = `Pendentes: ${count}`;
}

// Init
renderTasks();
