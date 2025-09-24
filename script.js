let words = {};
let currentUnit = [];
let currentWord = {};
let mistakes = [];
let total = 0;
let answered = 0;

const successGifs = [
  "https://media.giphy.com/media/111ebonMs90YLu/giphy.gif",
  "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExMmxkcDB2ZzNrMnEyd3Q5NGJpOTl2b3d1cm41MzUzazc3d2RpczRrayZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/fuJjrm6Cv2onpmpPEK/giphy.gif",
  "https://media.giphy.com/media/5GoVLqeAOo6PK/giphy.gif",
  "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExMzl0dmo4aW9xOTk2OG0xdHQzenkzaGtweXpsN2xlaDRyZDNwaGRmbiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/62PP2yEIAZF6g/giphy.gif"
];


async function loadWords() {
  const res = await fetch("words.json");
  words = await res.json();

  const unitsDiv = document.getElementById("units");
  Object.keys(words).forEach(unit => {
    const btn = document.createElement("button");
    btn.textContent = unit.toUpperCase();
    btn.onclick = () => startTest(unit);
    unitsDiv.appendChild(btn);
  });
}

function startTest(unit, customList = null) {
  document.getElementById("menu").classList.add("hidden");
  document.getElementById("result").classList.add("hidden");
  document.getElementById("test").classList.remove("hidden");

  if (customList) {
    currentUnit = customList.slice();
  } else if (unit === "all") {
    currentUnit = Object.values(words).flat().slice();
  } else {
    currentUnit = words[unit].slice();
  }

  mistakes = [];
  total = currentUnit.length;
  answered = 0;

  nextWord();
}

function nextWord() {
  if (currentUnit.length === 0) {
    showResult();
    return;
  }

  const idx = Math.floor(Math.random() * currentUnit.length);
  currentWord = currentUnit.splice(idx, 1)[0];

  document.getElementById("question").textContent = currentWord.ru;
  document.getElementById("answer").value = "";
  document.getElementById("answer").focus();
  document.getElementById("progress").textContent = 
    `Осталось: ${currentUnit.length + 1} / ${total}`;
}

function checkAnswer() {
  const input = document.getElementById("answer");
  const userAns = input.value.trim().toLowerCase();
  answered++;
  if (userAns !== currentWord.en.toLowerCase()) {
    mistakes.push({ru: currentWord.ru, correct: currentWord.en, your: userAns});
    flash(input, false);
  } else {
    flash(input, true);
  }
  nextWord();
}

function flash(el, correct) {
  el.classList.add(correct ? "correct" : "wrong");
  setTimeout(() => el.classList.remove("correct", "wrong"), 400);
}

function showResult() {
  document.getElementById("test").classList.add("hidden");
  document.getElementById("result").classList.remove("hidden");

  const score = total - mistakes.length;
  document.getElementById("score").textContent = 
    `Правильно: ${score}/${total}`;

  const mistakesList = document.getElementById("mistakes");
  mistakesList.innerHTML = "";
  
  if (mistakes.length === 0) {
    // Успех
    const gifUrl = successGifs[Math.floor(Math.random() * successGifs.length)];
    const img = document.createElement("img");
    img.src = gifUrl;
    img.alt = "Поздравляю!";
    img.style.maxWidth = "100%";
    img.style.marginTop = "15px";
    mistakesList.appendChild(img);
  } else {
    mistakes.forEach(m => {
    const li = document.createElement("li");
    li.textContent = `${m.ru} → ${m.correct} (твoй ответ: ${m.your || "-"})`;
    mistakesList.appendChild(li);
    });
  }
}

function goMenu() {
  document.getElementById("menu").classList.remove("hidden");
  document.getElementById("result").classList.add("hidden");
}

// Повторить только ошибки
function repeatMistakes() {
  if (mistakes.length === 0) {
    alert("Ошибок нет👌");
    return;
  }
  const retryList = mistakes.map(m => ({ru: m.ru, en: m.correct}));
  startTest(null, retryList);
}

// Переключатель темы
// function toggleTheme() {
//   document.body.classList.toggle("dark");
//   const btn = document.getElementById("themeToggle");
//   if (document.body.classList.contains("dark")) {
//     btn.textContent = "☀️";
//   } else {
//     btn.textContent = "🌙";
//   }
// }

const body = document.body;
const toggleBtn = document.getElementById("themeToggle");

// при загрузке — ставим тему по умолчанию (например, светлую)
if (!body.classList.contains("light") && !body.classList.contains("dark")) {
  body.classList.add("light");
}

toggleBtn.addEventListener("click", () => {
  if (body.classList.contains("light")) {
    body.classList.remove("light");
    body.classList.add("dark");
  } else {
    body.classList.remove("dark");
    body.classList.add("light");
  }
});


// ⌨️ Enter
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const testVisible = !document.getElementById("test").classList.contains("hidden");
    if (testVisible) {
      checkAnswer();
    }
  }
});

loadWords();
