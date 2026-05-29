// ===============================
// TASKFLOW PREMIUM
// ===============================

// Task Array
let tasks = JSON.parse(
  localStorage.getItem("tasks")
) || [];

// Elements
const addTaskBtn = document.getElementById("addTaskBtn");
const taskModal = document.getElementById("taskModal");
const saveTask = document.getElementById("saveTask");

const taskTitle = document.getElementById("taskTitle");
const taskDescription = document.getElementById("taskDescription");
const taskDate = document.getElementById("taskDate");
const taskPriority = document.getElementById("taskPriority");
const taskCategory = document.getElementById("taskCategory");

const taskList = document.getElementById("taskList");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");

const progressPercent =
  document.getElementById("progressPercent");

const progressRing =
  document.getElementById("progressRing");

const searchInput =
  document.getElementById("searchInput");

const motivation =
  document.querySelector(".motivation");

// ===============================
// OPEN MODAL
// ===============================

addTaskBtn.addEventListener("click", () => {

  taskModal.style.display = "flex";

  // Vibration
  if(navigator.vibrate){
    navigator.vibrate(50);
  }

});

// ===============================
// CLOSE MODAL
// ===============================

window.addEventListener("click", (e) => {

  if(e.target === taskModal){
    taskModal.style.display = "none";
  }

});

// ===============================
// SAVE TASK
// ===============================

saveTask.addEventListener("click", () => {

  if(taskTitle.value.trim() === ""){
    alert("Enter task title");
    return;
  }

  const task = {

    id: Date.now(),

    title: taskTitle.value,

    description: taskDescription.value,

    dueDate: taskDate.value,

    priority: taskPriority.value,

    category: taskCategory.value,

    completed: false,

    createdAt: new Date().toLocaleString()

  };

  tasks.push(task);

  saveToLocal();

  renderTasks();

  clearInputs();

  taskModal.style.display = "none";

});

// ===============================
// SAVE LOCAL STORAGE
// ===============================

function saveToLocal(){

  localStorage.setItem(
    "tasks",
    JSON.stringify(tasks)
  );

}

// ===============================
// CLEAR INPUTS
// ===============================

function clearInputs(){

  taskTitle.value = "";
  taskDescription.value = "";
  taskDate.value = "";
  taskCategory.value = "";

}

// ===============================
// RENDER TASKS
// ===============================

function renderTasks(filteredTasks = tasks){

  taskList.innerHTML = "";

  filteredTasks.forEach(task => {

    const card = document.createElement("div");

    card.className =
      `task-card glass ${
        task.completed ? "completed" : ""
      }`;

    card.innerHTML = `

      <h3>${task.title}</h3>

      <p>${task.description}</p>

      <div class="task-meta">

        <span>${task.dueDate || "No Date"}</span>

        <span class="priority ${task.priority.toLowerCase()}">
          ${task.priority}
        </span>

      </div>

      <div
        style="
          margin-top:15px;
          display:flex;
          gap:10px;
        "
      >

        <button onclick="toggleTask(${task.id})">
          ${
            task.completed
              ? "Undo"
              : "Complete"
          }
        </button>

        <button onclick="deleteTask(${task.id})">
          Delete
        </button>

      </div>

    `;

    taskList.appendChild(card);

  });

  updateDashboard();

}

// ===============================
// TOGGLE TASK
// ===============================

function toggleTask(id){

  tasks = tasks.map(task => {

    if(task.id === id){

      task.completed = !task.completed;

      // Vibration
      if(navigator.vibrate){
        navigator.vibrate([100,50,100]);
      }

      // Celebration
      if(task.completed){

        showCelebration();

      }

    }

    return task;

  });

  saveToLocal();

  renderTasks();

}

// ===============================
// DELETE TASK
// ===============================

function deleteTask(id){

  tasks = tasks.filter(
    task => task.id !== id
  );

  saveToLocal();

  renderTasks();

}

// ===============================
// DASHBOARD UPDATE
// ===============================

function updateDashboard(){

  const total = tasks.length;

  const completed =
    tasks.filter(
      task => task.completed
    ).length;

  const pending =
    total - completed;

  totalTasks.innerText = total;

  completedTasks.innerText = completed;

  pendingTasks.innerText = pending;

  // Progress
  const percent =
    total === 0
      ? 0
      : Math.round(
          (completed / total) * 100
        );

  progressPercent.innerText =
    `${percent}%`;

  // SVG Progress Ring
  const circumference = 377;

  const offset =
    circumference -
    (percent / 100) * circumference;

  progressRing.style.strokeDashoffset =
    offset;

  updateMotivation(percent);

}

// ===============================
// MOTIVATION TEXT
// ===============================

function updateMotivation(percent){

  if(percent === 0){

    motivation.innerText =
      "Awesome! Start your journey 🔥";

  }

  else if(percent <= 25){

    motivation.innerText =
      "Great start! Keep moving 🚀";

  }

  else if(percent <= 50){

    motivation.innerText =
      "Awesome! You're building momentum ⚡";

  }

  else if(percent <= 75){

    motivation.innerText =
      "You're crushing your goals 💪";

  }

  else if(percent < 100){

    motivation.innerText =
      "Almost done! Finish strong 🔥";

  }

  else{

    motivation.innerText =
      "Perfect victory! You're unstoppable 🏆";

  }

}

// ===============================
// SEARCH TASKS
// ===============================

searchInput.addEventListener("input", () => {

  const value =
    searchInput.value.toLowerCase();

  const filtered = tasks.filter(task =>

    task.title
      .toLowerCase()
      .includes(value)

  );

  renderTasks(filtered);

});

// ===============================
// CELEBRATION EFFECT
// ===============================

function showCelebration(){

  const celebration =
    document.createElement("div");

  celebration.innerHTML = "🎉⚡💖";

  celebration.style.position = "fixed";
  celebration.style.top = "50%";
  celebration.style.left = "50%";
  celebration.style.transform =
    "translate(-50%,-50%)";
  celebration.style.fontSize = "3rem";
  celebration.style.zIndex = "99999";

  document.body.appendChild(
    celebration
  );

  setTimeout(() => {

    celebration.remove();

  }, 1200);

}

// ===============================
// THEME TOGGLE
// ===============================

const themeToggle =
  document.getElementById("themeToggle");

themeToggle.addEventListener("click", () => {

  document.body.classList.toggle("light");

});

// ===============================
// INITIAL LOAD
// ===============================

renderTasks();
