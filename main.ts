// HTML / DOM
let listaComTarefas = document.querySelector("#listaComTarefas") as HTMLUListElement;
let form = document.querySelector(".taskForm") as HTMLFormElement;
let input = document.querySelector("input") as HTMLInputElement;
let countTasks = document.querySelector("#countPendingTasks") as HTMLDivElement;
let btnOrder = document.querySelector("#btnOrder") as HTMLButtonElement;
let selectCategoria = document.querySelector("#categoria") as HTMLSelectElement;

type Categoria = 'Trabalho' | 'Pessoal' | 'Estudo';

//Interface
interface Tarefa {
    id: number;
    titulo: string;
    concluida: boolean;
    categoria: Categoria;
    dataConclusao?: Date;

    editarTitulo(novoTitulo: string): void;
    toggleConcluida(): void;
}

//Class
class TarefaClass implements Tarefa {
    id: number;
    titulo: string;
    concluida: boolean;
    categoria: Categoria;
    dataConclusao?: Date;

    constructor(id: number, titulo: string, categoria: Categoria) {
        this.id = id;
        this.titulo = titulo;
        this.concluida = false;
        this.categoria = categoria;
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
    new TarefaClass (1, "Terminar os exercícios guiados da aula 2", "Estudo"),
    new TarefaClass (2, "Começar os exercícios autónomos da aula 2", "Estudo"),
    new TarefaClass (3, "Terminar os exercícios autónomos da aula 2", "Estudo"),
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

    updateIcon(); // Initial Icon

    btnCheck.addEventListener("click", (event) => {
        event.stopPropagation();
        tarefa.toggleConcluida();
        renderTasks();
    });

    return btnCheck;
}

// Create li and append buttons

function addLiTask(tarefa: Tarefa): HTMLLIElement {
    const li = document.createElement("li");
    li.classList.add("tarefa", tarefa.categoria.toLowerCase());

    /* --- TÍTULO --- */
    const tituloSpan = document.createElement("span");
    tituloSpan.textContent = tarefa.titulo;
    li.appendChild(tituloSpan);

    /* --- CATEGORIA --- */
    const categoriaSpan = document.createElement("span");
    categoriaSpan.textContent = tarefa.categoria;
    categoriaSpan.classList.add("categoria");
    li.appendChild(categoriaSpan);

    /* --- DATA DE CONCLUSÃO --- */
    if (tarefa.concluida && tarefa.dataConclusao) {
        const dataStr = tarefa.dataConclusao.toLocaleString("pt-PT", {
            day: "2-digit",
            month: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        });

        const dataP = document.createElement("p");
        dataP.textContent = `Concluída em: ${dataStr}`;
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
function renderTasks(): void {
    listaComTarefas.innerHTML = "";
    listaTarefas.forEach((tarefa) => {
        let li = addLiTask(tarefa);
        listaComTarefas.appendChild(li);
    });
    countPendingTasks();
}

//Form
form.addEventListener("submit", (event) => {
    event.preventDefault();
    const valor = input.value.trim();
    if (valor === "") return;
    const categoria = selectCategoria.value as Categoria;
    const novaTarefa = new TarefaClass(Date.now(), valor, categoria);
    listaTarefas.push(novaTarefa);

    renderTasks();
    input.value = "";
});

// Count Pending Tasks
function countPendingTasks(): void {
    const count = listaTarefas.filter(tarefa => !tarefa.concluida).length;
    countTasks.textContent = `Pendentes: ${count}`;
}

// Order button
btnOrder.addEventListener("click", (event) => {
    event.stopPropagation();
    listaTarefas.sort((a, b) => a.titulo.localeCompare(b.titulo));
    renderTasks();
});

// Init
renderTasks();
