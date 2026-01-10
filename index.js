"use strict";

let level = 1;
let wins = 0;
let maxRange = 20;
let timeLimit = 60;
let timer;
let timeLeft = timeLimit;
let gameActive = true;

let score = 20;
let highscore = 0;
let secretNumber = generateNumber();

const messageEl = document.querySelector(".message");
const scoreEl = document.querySelector(".score");
const highscoreEl = document.querySelector(".highscore");
const numberEl = document.querySelector(".number");
const levelEl = document.querySelector(".level");
const timerEl = document.querySelector(".timer");
const rangeText = document.getElementById("rangeText");
const progressBar = document.querySelector(".progress-bar");
const leaderboard = document.querySelector(".leaderboard");

function generateNumber() {
  return Math.trunc(Math.random() * maxRange) + 1;
}

function displayMessage(msg) {
  messageEl.textContent = msg;
}

function startTimer() {
  clearInterval(timer);
  timeLeft = timeLimit;
  timerEl.textContent = timeLeft;
  progressBar.style.width = "100%";

  timer = setInterval(() => {
    timeLeft--;
    timerEl.textContent = timeLeft;
    progressBar.style.width = (timeLeft / timeLimit) * 100 + "%";

    if (timeLeft <= 0) {
      clearInterval(timer);
      loseGame();
    }
  }, 1000);
}

function updateTheme(win = false, lose = false) {
  if (lose) {
    document.body.style.background = "red";
    return;
  }

  if (win) {
    document.body.style.background = "lightgreen";
    return;
  }

  if (level === 1) document.body.style.background = "#222";
  if (level === 2) document.body.style.background = "#003366";
  if (level === 3) document.body.style.background = "#b59b00";
}

function updateRange() {
  rangeText.textContent = `(Between 1 and ${maxRange})`;
}

function nextLevel() {
  if (wins === 3) {
    level = 2;
    maxRange = 50;
    timeLimit = 40;
  }
  if (wins === 6) {
    level = 3;
    maxRange = 100;
    timeLimit = 30;
  }

  levelEl.textContent = level;
  updateRange();
}

function winGame() {
  clearInterval(timer);
  gameActive = false;
  wins++;
  updateTheme(true, false);

  if (score > highscore) {
    highscore = score;
    highscoreEl.textContent = highscore;
  }

  leaderboard.innerHTML += `<li>Level ${level} – Score ${score}</li>`;

  nextLevel();
}

function loseGame() {
  clearInterval(timer);
  gameActive = false;
  displayMessage("💔 You lost!");
  updateTheme(false, true);
  scoreEl.textContent = 0;
}

document.querySelector(".check").addEventListener("click", function () {
  if (!gameActive) return;
  const guess = Number(document.querySelector(".guess").value);

  if (!guess) {
    displayMessage("⛔ Enter a number");
    return;
  }

  if (guess === secretNumber) {
    displayMessage("🏆 Correct!");
    numberEl.textContent = secretNumber;
    winGame();
  } else {
    if (score > 1) {
      displayMessage(guess > secretNumber ? "📈 Too High" : "📉 Too Low");
      score--;
      scoreEl.textContent = score;
    } else {
      loseGame();
    }
  }
});

document.querySelector(".again").addEventListener("click", function () {
  gameActive = true;
  score = 20;
  scoreEl.textContent = score;
  numberEl.textContent = "?";
  document.querySelector(".guess").value = "";

  secretNumber = generateNumber();
  displayMessage("Start guessing...");
  updateTheme();
  startTimer();
});

updateRange();
startTimer();
