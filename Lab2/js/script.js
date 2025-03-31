const canvas = document.getElementById("editor");
const slider = document.getElementById("slider");
canvas.height = window.innerHeight;
canvas.width = window.innerWidth * 0.8;
let selectedDotIndex = -1;
var gap = 0;
let dots = [];
let curveDots = []; //Масив точок у реальній системі координат (пікселі екрана)
window.addEventListener(
  "load",
  sliderAlignAndCoordinates(document.getElementById("slider"))
);
slider.addEventListener("input", sliderAlignAndCoordinates);

function sliderAlignAndCoordinates(event) {
  const sliderValue = document.getElementById("curr-amount");
  sliderValue.textContent = slider.value;
  const thumbWidth =
    (parseInt(window.getComputedStyle(slider).getPropertyValue("width")) *
      this.value) /
    (parseInt(this.max) - parseInt(this.min));
  sliderValue.style.left = `${
    slider.getBoundingClientRect().left + thumbWidth - 20
  }px`;
  sliderValue.style.top = `${
    slider.getBoundingClientRect().top - slider.offsetHeight * 2
  }px`;
  buildCoordinates(slider.value);
}

function buildCoordinates(value) {
  var context = canvas.getContext("2d");
  context.clearRect(0, 0, canvas.width, canvas.height);

  // Сітка
  var ct = canvas.getContext("2d");
  ct.strokeStyle = "#414141";
  ct.beginPath();
  gap = canvas.height / (parseInt(value) * 2);
  for (var i = 0; i < parseInt(value) * 2; i++) {
    ct.moveTo(0, i * gap);
    ct.lineTo(canvas.width, i * gap);
  }

  var n = parseInt(canvas.width / gap);
  var start = (canvas.width - n * gap) / 2;
  if (n % 2 !== 0) {
    start += gap / 2;
  }
  for (var i = 0; i < n * 2; i++) {
    ct.moveTo(start + i * gap, 0);
    ct.lineTo(start + i * gap, canvas.height);
  }
  ct.stroke();

  ct.beginPath();
  ct.strokeStyle = "#A1A1A1";
  ct.moveTo(0, canvas.height / 2);
  ct.lineTo(canvas.width, canvas.height / 2);
  ct.moveTo(canvas.width / 2, 0);
  ct.lineTo(canvas.width / 2, canvas.height);
  ct.stroke();

  // Керуючі точки та лінії
  ct.strokeStyle = "#99BC85";
  ct.fillStyle = "#99BC85";
  var prevX = 0,
    prevY = 0;
  for (var i = 0; i < dots.length; i++) {
    var dot = dots[i];
    ct.beginPath();
    var newX = canvas.width / 2 + dot[0] * gap;
    var newY = canvas.height / 2 - dot[1] * gap;
    ct.arc(newX, newY, 5, 0, 2 * Math.PI);
    ct.fillText("P" + i, newX - 20, newY);
    ct.fill();
    ct.closePath();
    if (i === 0) {
      prevX = newX;
      prevY = newY;
      continue;
    }
    ct.moveTo(prevX, prevY);
    ct.lineTo(newX, newY);
    ct.stroke();
    prevX = newX;
    prevY = newY;
  }

  // Крива Безьє
  if (dots.length >= 3) {
    drawBezierCurve(dots);
  }
}

function convertXYtoReal(dot) {
  return [canvas.width / 2 + dot[0] * gap, canvas.height / 2 - dot[1] * gap];
}

function convertRealToLocal(realX, realY) {
  return [(realX - canvas.width / 2) / gap, (canvas.height / 2 - realY) / gap];
}

function casteljauAlgorithm(points, t) {
  var ct = canvas.getContext("2d");
  let p = points.map((dot) => convertXYtoReal(dot));

  // Алгоритм де Кастельйо
  while (p.length > 1) {
    let pNew = [];
    ct.beginPath();
    for (let j = 0; j < p.length - 1; j++) {
      let x = (1 - t) * p[j][0] + t * p[j + 1][0];
      let y = (1 - t) * p[j][1] + t * p[j + 1][1];
      pNew.push([x, y]);
    }
    p = pNew;
  }

  const epsilon = 1e-6; // Допустима похибка для порівняння
  if (Math.abs(t - 0) < epsilon) {
    // Початкова точка (t = 0)
    ct.fillStyle = "#143D60"; // Зелений
  } else if (Math.abs(t - 1) < epsilon) {
    // Кінцева точка (t = 1)
    ct.fillStyle = "#143D60"; // Зелений
  } else {
    // Решта точок
    ct.fillStyle = "#e3645b"; // Червоний
  }

  // Малювання точки
  ct.beginPath();
  ct.arc(p[0][0], p[0][1], 3, 0, 2 * Math.PI);
  ct.fill();

  curveDots.push([p[0][0], p[0][1]]);
}

function drawBezierCurve(points) {
  curveDots = [];
  let h = 1 / Math.max(parseInt(document.getElementById("h-gap").value), 100);
  for (let t = 0; t <= 1 + h / 2; t += h) {
    casteljauAlgorithm(points, Math.min(t, 1)); // t не перевищує 1
  }
}

canvas.addEventListener("click", createDot);

function createDot(event) {
  var rect = canvas.getBoundingClientRect();
  var x = event.clientX - rect.left;
  var y = event.clientY - rect.top;
  var local = convertRealToLocal(x, y);
  dots.push([local[0], local[1]]);
  buildCoordinates(slider.value);
}

function clearAll() {
  dots = [];
  curveDots = [];
  buildCoordinates(slider.value);
}

// Виведення координат з кроком по X
function getPointsRange() {
  console.clear();
  let step = parseFloat(document.getElementById("h-num").value);
  if (step <= 0) {
    alert("Крок має бути додатнім");
    return;
  }

  let localPoints = curveDots.map((dot) => {
    let local = convertRealToLocal(dot[0], dot[1]);
    return { x: local[0], y: local[1] };
  }); //Масив localPoints з координатами {x, y} у локальній системі

  localPoints.sort((a, b) => a.x - b.x);

  let minX = Math.floor(localPoints[0].x / step) * step;
  let maxX = Math.ceil(localPoints[localPoints.length - 1].x / step) * step;

  console.log("Координати з кроком " + step + " по X:");
  for (let x = minX; x <= maxX; x += step) {
    let closest = localPoints.reduce((prev, curr) =>
      Math.abs(curr.x - x) < Math.abs(prev.x - x) ? curr : prev
    );
    console.log(`X: ${closest.x.toFixed(2)}, Y: ${closest.y.toFixed(2)}`);
  }
}

// Обчислення поліномів Бернштейна
function calculateBernstein() {
  console.clear();
  let t = parseFloat(document.getElementById("bernstein-t").value);
  if (t < 0 || t > 1) {
    alert("t має бути між 0 та 1");
    return;
  }
  let m = dots.length - 1; // Ступінь кривої
  if (m < 2) {
    alert("Потрібно щонайменше 3 точки");
    return;
  }
  for (let i = 0; i <= m - 2; i++) {
    let bern = combination(m, i) * Math.pow(t, i) * Math.pow(1 - t, m - i);
    console.log(`B_${i}^${m}(t) = ${bern.toFixed(4)}`);
  }
}

// Допоміжні функції
function combination(n, k) {
  return factorial(n) / (factorial(k) * factorial(n - k));
}

function factorial(num) {
  if (num === 0) return 1;
  return num * factorial(num - 1);
}

document.getElementById("clearField").addEventListener("click", clearAll);
document
  .getElementById("show-something")
  .addEventListener("click", getPointsRange);
document
  .getElementById("bernstein-polynom")
  .addEventListener("click", calculateBernstein);
