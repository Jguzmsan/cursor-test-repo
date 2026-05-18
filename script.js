const words = [
  "celonis",
  "process",
  "mining",
  "execution",
  "conformance",
  "variant",
  "bottleneck",
  "automation",
  "throughput",
  "handover",
  "discovery",
  "workflow",
  "studio",
  "analyst",
  "transformation",
  "benchmark",
  "insight",
  "knowledge",
  "modeler",
  "rework",
];

const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");
const maxMistakes = 6;

const wordElement = document.querySelector("#word");
const keyboardElement = document.querySelector("#keyboard");
const statusElement = document.querySelector("#status");
const attemptsLeftElement = document.querySelector("#attempts-left");
const restartButton = document.querySelector("#restart");
const bodyParts = document.querySelectorAll(".body-part");

let currentWord = "";
let guessedLetters = new Set();
let mistakes = 0;
let gameOver = false;

function pickWord() {
  const randomIndex = Math.floor(Math.random() * words.length);
  return words[randomIndex];
}

function normalizeLetter(letter) {
  return letter.toLowerCase();
}

function startGame() {
  currentWord = pickWord();
  guessedLetters = new Set();
  mistakes = 0;
  gameOver = false;

  statusElement.textContent = "Pick a letter to start mining.";
  statusElement.className = "status";
  attemptsLeftElement.textContent = String(maxMistakes);

  renderWord();
  renderKeyboard();
  updateHangman();
}

function renderWord() {
  wordElement.innerHTML = "";

  currentWord.split("").forEach((letter) => {
    const slot = document.createElement("span");
    slot.className = "letter-slot";
    slot.textContent = guessedLetters.has(letter) || gameOver ? letter : "";
    wordElement.appendChild(slot);
  });
}

function renderKeyboard() {
  keyboardElement.innerHTML = "";

  alphabet.forEach((letter) => {
    const key = document.createElement("button");
    key.className = "key";
    key.type = "button";
    key.textContent = letter;
    key.setAttribute("aria-label", `Try letter ${letter}`);

    if (guessedLetters.has(letter)) {
      key.disabled = true;
      key.classList.add(currentWord.includes(letter) ? "correct" : "wrong");
    }

    if (gameOver) {
      key.disabled = true;
    }

    key.addEventListener("click", () => handleGuess(letter));
    keyboardElement.appendChild(key);
  });
}

function handleGuess(letter) {
  if (gameOver || guessedLetters.has(letter)) {
    return;
  }

  guessedLetters.add(letter);

  if (currentWord.includes(letter)) {
    statusElement.textContent = "Nice signal — that letter is in the process.";
  } else {
    mistakes += 1;
    statusElement.textContent = "Friction detected. That letter is not here.";
  }

  updateGameState();
  renderWord();
  renderKeyboard();
  updateHangman();
}

function updateGameState() {
  const hasWon = currentWord
    .split("")
    .every((letter) => guessedLetters.has(letter));
  const hasLost = mistakes >= maxMistakes;

  attemptsLeftElement.textContent = String(maxMistakes - mistakes);

  if (hasWon) {
    gameOver = true;
    statusElement.textContent = "Process optimized! You guessed the word.";
    statusElement.className = "status win";
  }

  if (hasLost) {
    gameOver = true;
    statusElement.textContent = `Process broken. The word was "${currentWord}".`;
    statusElement.className = "status lose";
  }
}

function updateHangman() {
  bodyParts.forEach((part) => {
    const partIndex = Number(part.dataset.part);
    part.classList.toggle("visible", partIndex <= mistakes);
  });
}

document.addEventListener("keydown", (event) => {
  const letter = normalizeLetter(event.key);

  if (alphabet.includes(letter)) {
    handleGuess(letter);
  }
});

restartButton.addEventListener("click", startGame);

startGame();
