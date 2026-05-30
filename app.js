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
const dailyStreak =
document.getElementById("dailyStreak");

const productivityScore =
document.getElementById("productivityScore");

const successSound =
document.getElementById("successSound");

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

      <div class="task-actions">

        <button
          class="complete-btn"
          onclick="toggleTask(${task.id})"
        >
          ${task.completed ? "Undo" : "Complete"}
        </button>

        <button
          class="delete-btn"
          onclick="deleteTask(${task.id})"
        >
          Delete
        </button>

      </div>

    `;

    // Add card to screen
    taskList.appendChild(card);

    // ==========================
    // SWIPE GESTURES
    // ==========================

    let startX = 0;

    card.addEventListener("touchstart", e => {

      startX = e.touches[0].clientX;

    });

    card.addEventListener("touchmove", e => {

      const currentX =
        e.touches[0].clientX;

      const diff =
        currentX - startX;

      card.style.transform =
        `translateX(${diff}px)`;

      if(diff > 0){

        card.classList.add(
          "swiping-right"
        );

        card.classList.remove(
          "swiping-left"
        );

      }else{

        card.classList.add(
          "swiping-left"
        );

        card.classList.remove(
          "swiping-right"
        );

      }

    });

    card.addEventListener("touchend", e => {

      const endX =
        e.changedTouches[0].clientX;

      const diff =
        endX - startX;

      // Swipe Right = Complete
      if(diff > 120){

        toggleTask(task.id);

      }

      // Swipe Left = Delete
      else if(diff < -120){

        deleteTask(task.id);

      }

      card.style.transform =
        "translateX(0)";

      card.classList.remove(
        "swiping-right",
        "swiping-left"
      );

    });

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

  updateStreak();

  // Play sound
  successSound.currentTime = 0;
  successSound.play();

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

  // Productivity Score
const productivity =
  total === 0
    ? 0
    : Math.round(
        (completed / total) * 100
      );

productivityScore.innerText =
  productivity + "%";

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

  // Heart Burst
  const heart =
    document.createElement("div");

  heart.classList.add("heart");

  heart.innerHTML = "💖";

  heart.style.left =
    Math.random() * 80 + "%";

  heart.style.top =
    Math.random() * 80 + "%";

  document.body.appendChild(heart);

  setTimeout(() => {

    heart.remove();

  },1000);

  // Confetti
  for(let i=0; i<40; i++){

    const confetti =
      document.createElement("div");

    confetti.classList.add("confetti");

    confetti.style.left =
      Math.random() * 100 + "vw";

    confetti.style.background =
      `hsl(${Math.random()*360},
      100%,50%)`;

    confetti.style.animationDuration =
      Math.random() * 2 + 1 + "s";

    document.body.appendChild(confetti);

    setTimeout(() => {

      confetti.remove();

    },3000);

  }

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


// ===============================
// FLOATING PARTICLES
// ===============================

function createParticles(){

  for(let i=0; i<20; i++){

    const particle =
      document.createElement("div");

    particle.classList.add("particle");

    particle.style.left =
      Math.random() * 100 + "vw";

    particle.style.animationDuration =
      Math.random() * 10 + 10 + "s";

    particle.style.opacity =
      Math.random();

    document.body.appendChild(
      particle
    );

  }

}

createParticles();


// ===============================
// DAILY STREAK SYSTEM
// ===============================

function updateStreak(){

  const today =
    new Date().toDateString();

  let streakData =
    JSON.parse(
      localStorage.getItem("streakData")
    ) || {

      streak:0,
      lastCompleted:""

    };

  // Same day already counted
  if(streakData.lastCompleted === today){

    return;

  }

  const yesterday =
    new Date();

  yesterday.setDate(
    yesterday.getDate() - 1
  );

  // Continue streak
  if(
    streakData.lastCompleted ===
    yesterday.toDateString()
  ){

    streakData.streak++;

  }

  else{

    streakData.streak = 1;

  }

  streakData.lastCompleted = today;

  localStorage.setItem(
    "streakData",
    JSON.stringify(streakData)
  );

  dailyStreak.innerText =
    streakData.streak;

}

// ===============================
// LOAD STREAK
// ===============================

function loadStreak(){

  let streakData =
    JSON.parse(
      localStorage.getItem("streakData")
    ) || {

      streak:0

    };

  dailyStreak.innerText =
    streakData.streak;

}

loadStreak();
