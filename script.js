
const lista = document.getElementById("task-list");
const taskInput = document.getElementById("task-input");
const count = document.getElementById("count");
let tasks = [],
  filtro = "todas";


const limparBtn = document.createElement("button");
limparBtn.id = "limpar";
limparBtn.textContent = "Limpar Concluídas";
document.getElementById("filtros").appendChild(limparBtn);

document.getElementById("add-task").addEventListener("click", addTask);
taskInput.addEventListener("keypress", (e) => e.key === "Enter" && addTask());

lista.addEventListener("click", (e) => {
  const li = e.target.closest("li");
  if (!li) return;
  const id = parseInt(li.dataset.id);
  if (e.target.type === "checkbox") toggleTask(id);
  else if (e.target.classList.contains("editar")) editTask(id, li);
  else if (e.target.classList.contains("excluir")) deleteTask(id);
});

document.getElementById("filtros").addEventListener("click", (e) => {
  if (e.target.id === "Pendentes") filtro = "pendentes";
  else if (e.target.id === "Concluídas") filtro = "concluidas";
  else if (e.target.id === "Todas") filtro = "todas";
  else if (e.target.id === "limpar") {
    tasks = tasks.filter((t) => !t.completed);
    updateCount();
    render();
  }

  render();
});

document.getElementById("clearbutton").addEventListener("click", () => {
  tasks = [];
  render();
  updateCount();
});

function addTask() {
  const text = taskInput.value.trim();
  if (text) {
    tasks.push({ id: Date.now(), text, completed: false });
    taskInput.value = "";  
    render();
    updateCount();
  }
  
  
  localStorage.setItem("tasks", JSON.stringify(tasks));

}

function loadTasks() {
  const savedTasks = localStorage.getItem("tasks");
  if (savedTasks) {
    tasks = JSON.parse(savedTasks);
    render();
    updateCount();
  }}
  loadTasks ();


function render() {
  lista.innerHTML = "";
  tasks
    .filter((t) => {
      if (filtro === "pendentes") return !t.completed;
      if (filtro === "concluidas") return t.completed;
      return true;
    })
    .forEach((t) => {
      const li = document.createElement("li");
      li.dataset.id = t.id;
      li.innerHTML = `<input type="checkbox" ${t.completed ? "checked" : ""}>
        <span class="${t.completed ? "completed" : ""}">${t.text}</span>
        <button class="editar">Editar</button>
        <button class="excluir">Excluir</button>`;
      lista.appendChild(li);
    });
}

function editTask(id, li) {
  const task = tasks.find((t) => t.id === id);
  if (!task) return;

  const span = li.querySelector("span");
  const input = document.createElement("input");
  input.value = task.text;

  span.replaceWith(input);
  input.focus();

  const save = () => {
    task.text = input.value.trim() || task.text;
    render();
  };

  input.addEventListener("blur", save);
  input.addEventListener("keypress", (e) => e.key === "Enter" && save());
}

function deleteTask(id) {
  tasks = tasks.filter((t) => t.id !== id);
  render();
  updateCount();
}

function toggleTask(id) {
  const task = tasks.find((t) => t.id === id);
  if (task) {
    task.completed = !task.completed;
    render();
    updateCount();
       savedTasks = localStorage.setItem("tasks", JSON.stringify(tasks));
  }
}

function updateCount() {
  count.textContent = tasks.filter((t) => !t.completed).length;
}

updateCount();