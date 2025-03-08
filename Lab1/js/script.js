const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

drawDec();

function drawDec() {
  ctx.font = "18px Arial";
  ctx.fillStyle = "black";
  ctx.textAlign = "center";
  ctx.fillText("x", 790, 380);
  ctx.fillText("y", 420, 15);
  ctx.moveTo(0, 400);
  ctx.lineTo(800, 400);
  ctx.lineTo(790, 390);
  ctx.moveTo(800, 400);
  ctx.lineTo(790, 410);
  ctx.moveTo(400, 0);
  ctx.lineTo(390, 10);
  ctx.moveTo(400, 0);
  ctx.lineTo(410, 10);
  ctx.moveTo(400, 0);
  ctx.lineTo(400, 800);
  ctx.stroke();

  for (let i = 390, j = 20; j <= 780; j += 10) {
    if (j % 20 === 0) {
      ctx.moveTo(i, j);
      ctx.lineTo(i + 20, j);
    } else {
      ctx.moveTo(i + 5, j);
      ctx.lineTo(i + 15, j);
    }
  }
  ctx.stroke();

  for (let i = 20, j = 390; i <= 780; i += 10) {
    if (i % 20 === 0) {
      ctx.moveTo(i, j);
      ctx.lineTo(i, j + 20);
    } else {
      ctx.moveTo(i, j + 5);
      ctx.lineTo(i, j + 15);
    }
  }
  ctx.stroke();

  ctx.font = "8px Arial";
  for (
    let i = -((canvas.width - 40) / 20 / 2),
      xx = 20,
      xy = 420,
      yx = 380,
      yy = 20;
    i <= (canvas.width - 40) / 20 / 2;
    i++, xx += 20, yy += 20
  ) {
    if (i !== 0) {
      ctx.fillText(i.toString(), xx, xy);
      ctx.fillText((-i).toString(), yx, yy);
    }
  }
}

function draw() {
  const x1 = parseFloat(document.getElementById("x1").value);
  const y1 = parseFloat(document.getElementById("y1").value);
  const x2 = parseFloat(document.getElementById("x2").value);
  const y2 = parseFloat(document.getElementById("y2").value);
  const fillColor = document.getElementById("fillColor").value;
  const vertexType = document.getElementById("vertexType").value;

  const dx = x2 - x1;
  const dy = y2 - y1;
  const sideLength = Math.sqrt(dx * dx + dy * dy);

  const height = (Math.sqrt(3) / 2) * sideLength;

  const x3 = x1 + dx / 2 - dy * (height / sideLength);
  const y3 = y1 + dy / 2 + dx * (height / sideLength);

  ctx.beginPath(); /*починаю новий шлях для малювання*/
  ctx.moveTo(
    x1 * 20 + 400,
    400 - y1 * 20
  ); /*переміщує перо до першої вершини */
  ctx.lineTo(x2 * 20 + 400, 400 - y2 * 20); /*малює лінії до інших вершин*/
  ctx.lineTo(x3 * 20 + 400, 400 - y3 * 20);
  ctx.closePath(); /*замикає шлях, з'єднуючи останню точку з першою*/
  ctx.fillStyle = fillColor;
  ctx.fill();
  ctx.stroke();

  drawVertex(x1 * 20 + 400, 400 - y1 * 20, vertexType);
  drawVertex(x2 * 20 + 400, 400 - y2 * 20, vertexType);
  drawVertex(x3 * 20 + 400, 400 - y3 * 20, vertexType);
}

function drawVertex(x, y, type) {
  if (type === "circle") {
    ctx.beginPath();
    ctx.arc(
      x,
      y,
      5,
      0,
      2 * Math.PI
    ); /*малює коло з центром у (x, y), радіусом 5 пікселів, від кута 0 до 2π (повне коло).*/
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.stroke();
  } else if (type === "square") {
    ctx.fillStyle = "red";
    ctx.fillRect(
      x - 5,
      y - 5,
      10,
      10
    ); /*x - 5, y - 5 — зміщення координат, щоб центр квадрата був у точці (x, y).*/
  }
}

function clear() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawDec();
}

document.getElementById("draw").addEventListener("click", draw);
document.getElementById("clear").addEventListener("click", clear);
