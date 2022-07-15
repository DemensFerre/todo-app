const form = document.querySelector("#form");
const taskInput = form.querySelector("#taskInput");
const tasksList = document.querySelector("#tasksList");

let tasks = [];

const saveToLS = function () {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

const renderTasks = function (task) {
  const cssClass = task.done ? "task-title task-title--done" : "task-title";

  const taskHTML = `
  <li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
    <span class="${cssClass}">${task.text}</span>
    <div class="task-item__buttons">
      <button type="button" data-action="done" class="btn-action">
        <img src="./img/tick.svg" alt="Done" width="18" height="18" />
      </button>
      <button type="button" data-action="delete" class="btn-action">
        <img src="./img/cross.svg" alt="Done" width="18" height="18" />
      </button>
    </div>
  </li>
    `;

  tasksList.insertAdjacentHTML("beforeend", taskHTML);
};

if (localStorage.getItem("tasks")) {
  tasks = JSON.parse(localStorage.getItem("tasks"));

  tasks.forEach((item) => {
    renderTasks(item);
  });
}

const checkEmptyList = function () {
  const emptyListHTML = `
    <li id="emptyList" class="list-group-item empty-list">
      <img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3" />
      <div class="empty-list__title">Список дел пуст</div>
    </li>`;

  if (tasks.length === 0) {
    tasksList.insertAdjacentHTML("beforeend", emptyListHTML);
  }

  if (tasks.length > 0) {
    const emptyListEl = document.querySelector("#emptyList");

    emptyListEl ? emptyListEl.remove() : null;
  }
};

const addTasks = function (event) {
  event.preventDefault();

  const taskText = taskInput.value;

  const taskObj = {
    id: Date.now(),
    text: taskText,
    done: false,
  };

  renderTasks(taskObj);

  taskInput.value = "";
  taskInput.focus();

  tasks.push(taskObj);

  saveToLS();
  checkEmptyList();
};

const deleteTasks = function (event) {
  if (event.target.dataset.action === "delete") {
    const parentNode = event.target.closest(".list-group-item");

    const parentId = +parentNode.id;

    const index = tasks.findIndex((item) => item.id === parentId);

    tasks.splice(index, 1);

    saveToLS();

    parentNode.remove();

    checkEmptyList();
  }
};

const doneTasks = function (event) {
  if (event.target.dataset.action === "done") {
    const parentNode = event.target.closest(".list-group-item");

    const parentId = +parentNode.id;

    const taskTitle = parentNode.querySelector(".task-title");

    const task = tasks.find((item) => item.id === parentId);

    task.done = !task.done;

    saveToLS();

    taskTitle.classList.toggle("task-title--done");
  }
};

checkEmptyList();

form.addEventListener("submit", addTasks);

tasksList.addEventListener("click", deleteTasks);

tasksList.addEventListener("click", doneTasks);
