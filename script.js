const openModalBtn = document.getElementById("openModalBtn");
const todoModal = document.getElementById("todoModal");
const cancelBtn = document.getElementById("cancelBtn");
const saveBtn = document.getElementById("saveBtn");
const modalTitle = document.getElementById("modalTitle");

const taskInput = document.getElementById("task");
const assignmentInput = document.getElementById("assignment");
const taskStatusInput = document.getElementById("taskStatus");
const deadlineInput = document.getElementById("deadline");
const filterSelect = document.getElementById("filter");
const todoList = document.getElementById("todoList");

let editId = null;

document.addEventListener("DOMContentLoaded", () => {
  let todos = JSON.parse(localStorage.getItem("todo")) || [];

  if (todos.length === 0) {
    todos = [
      {
        id: Date.now(),
        task: "Finish project report",
        assignment: "College Work",
        taskStatus: "pending",
        deadline: "2025-11-10",
      },
      {
        id: Date.now() + 1,
        task: "Buy groceries",
        assignment: "Personal",
        taskStatus: "completed",
        deadline: "2025-11-07",
      },
      {
        id: Date.now() + 2,
        task: "Team meeting with manager",
        assignment: "Office",
        taskStatus: "pending",
        deadline: "2025-11-08",
      },
    ];

    localStorage.setItem("todo", JSON.stringify(todos));
  }

  showTodos();
});

openModalBtn.addEventListener("click", () => {
  modalTitle.textContent = "Add New Task";
  clearInputs();
  todoModal.style.display = "flex";
});

cancelBtn.addEventListener("click", () => {
  todoModal.style.display = "none";
});

saveBtn.addEventListener("click", () => {
  const task = taskInput.value.trim();
  const assignment = assignmentInput.value.trim();
  const status = taskStatusInput.value;
  const deadline = deadlineInput.value;

  if (!task || !assignment || !status || !deadline) {
    alert("Please fill all fields!");
    return;
  }

  const todos = JSON.parse(localStorage.getItem("todo")) || [];

  if (editId) {
    const updatedTodos = todos.map((t) =>
      t.id === editId
        ? { ...t, task, assignment, taskStatus: status, deadline }
        : t
    );
    localStorage.setItem("todo", JSON.stringify(updatedTodos));
    editId = null;
  } else {
    const newTodo = {
      id: Date.now(),
      task,
      assignment,
      taskStatus: status,
      deadline,
    };
    todos.push(newTodo);
    localStorage.setItem("todo", JSON.stringify(todos));
  }

  todoModal.style.display = "none";
  showTodos();
});

filterSelect.addEventListener("change", showTodos);

function showTodos() {
  const todos = JSON.parse(localStorage.getItem("todo")) || [];
  const filter = filterSelect.value;
  todoList.innerHTML = "";

  const filteredTodos =
    filter === "all" ? todos : todos.filter((t) => t.taskStatus === filter);

  if (filteredTodos.length === 0) {
    todoList.innerHTML = `<p>No tasks found.</p>`;
    return;
  }

  filteredTodos.forEach((todo) => {
    const div = document.createElement("div");
    div.classList.add("todo-item");
    div.innerHTML = `
      <div class="todo-header">
        <strong>${todo.task}</strong>
        <span style="font-size: medium;">${todo.taskStatus.toUpperCase()}</span>
      </div>
      <p>Assignment: ${todo.assignment}</p>
      <p>Deadline: ${todo.deadline}</p>
      <div class="todo-buttons">
        <button onclick="editTodo(${todo.id})">Edit</button>
        <button onclick="deleteTodo(${todo.id})">Delete</button>
      </div>
    `;
    todoList.appendChild(div);
  });
}

function editTodo(id) {
  const todos = JSON.parse(localStorage.getItem("todo")) || [];
  const todo = todos.find((t) => t.id === id);

  if (todo) {
    editId = id;
    modalTitle.textContent = "Edit Task";
    taskInput.value = todo.task;
    assignmentInput.value = todo.assignment;
    taskStatusInput.value = todo.taskStatus;
    deadlineInput.value = todo.deadline;
    todoModal.style.display = "flex";
  }
}

function deleteTodo(id) {
  const todos = JSON.parse(localStorage.getItem("todo")) || [];
  const updatedTodos = todos.filter((t) => t.id !== id);
  localStorage.setItem("todo", JSON.stringify(updatedTodos));
  showTodos();
}

function clearInputs() {
  taskInput.value = "";
  assignmentInput.value = "";
  taskStatusInput.value = "";
  deadlineInput.value = "";
}

showTodos();