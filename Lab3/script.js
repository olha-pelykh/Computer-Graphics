const canvas = document.getElementById("editor");
const ctx = canvas.getContext("2d");

// Initialize canvas
function initCanvas() {
  canvas.width = window.innerWidth * 0.8;
  canvas.height = window.innerHeight;
}
initCanvas();
window.addEventListener("resize", initCanvas);

// Event Listeners
document.getElementById("hilbert-build").addEventListener("click", drawHilbert);
document.getElementById("sh-build").addEventListener("click", drawShFractal);
document.getElementById("clearField").addEventListener("click", clearAll);

// Clear canvas
function clearAll() {
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Hilbert-Peano Curve
function drawHilbert() {
  clearAll();
  const n = parseInt(document.getElementById("hilbert-n").value);
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 2;
  ctx.beginPath();

  const size = Math.min(canvas.width, canvas.height) * 0.9;
  const x0 = (canvas.width - size) / 2;
  const y0 = (canvas.height - size) / 2;

  hilbert(x0, y0, size, 0, 0, size, n);
  ctx.stroke();
}

function hilbert(x0, y0, xi, xj, yi, yj, n) {
  if (n <= 0) {
    ctx.lineTo(x0 + (xi + yi) / 2, y0 + (xj + yj) / 2);
  } else {
    hilbert(x0, y0, yi / 2, yj / 2, xi / 2, xj / 2, n - 1);
    hilbert(x0 + xi / 2, y0 + xj / 2, xi / 2, xj / 2, yi / 2, yj / 2, n - 1);
    hilbert(
      x0 + xi / 2 + yi / 2,
      y0 + xj / 2 + yj / 2,
      xi / 2,
      xj / 2,
      yi / 2,
      yj / 2,
      n - 1
    );
    hilbert(
      x0 + xi / 2 + yi,
      y0 + xj / 2 + yj,
      -yi / 2,
      -yj / 2,
      -xi / 2,
      -xj / 2,
      n - 1
    );
  }
}

// sh(z) + c Fractal
function drawShFractal() {
  const cReal = parseFloat(document.getElementById("c-real").value);
  const cImag = parseFloat(document.getElementById("c-imag").value);

  const width = canvas.width;
  const height = canvas.height;
  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;

  const maxIterations = 100;
  const escapeRadius = 10;

  // Complex hyperbolic sine function
  function complexSinh(z) {
    const x = z[0],
      y = z[1];
    return [Math.sinh(x) * Math.cos(y), Math.cosh(x) * Math.sin(y)];
  }

  // Complex addition
  function complexAdd(a, b) {
    return [a[0] + b[0], a[1] + b[1]];
  }

  // Complex magnitude
  function complexMagnitude(z) {
    return Math.sqrt(z[0] * z[0] + z[1] * z[1]);
  }

  const c = [cReal, cImag];
  const scale = 0.005;
  const centerX = 0;
  const centerY = 0;

  for (let py = 0; py < height; py++) {
    for (let px = 0; px < width; px++) {
      const x0 = (px - width / 2) * scale + centerX;
      const y0 = (py - height / 2) * scale + centerY;

      let z = [x0, y0];
      let iteration = 0;

      while (iteration < maxIterations && complexMagnitude(z) < escapeRadius) {
        z = complexAdd(complexSinh(z), c);
        iteration++;
      }

      const idx = (py * width + px) * 4;

      if (iteration === maxIterations) {
        data[idx] = 0;
        data[idx + 1] = 0;
        data[idx + 2] = 0;
      } else {
        // Color based on iteration count
        const t = iteration / maxIterations;
        data[idx] = 255 * t;
        data[idx + 1] = 255 * (1 - t);
        data[idx + 2] = 255 * (0.5 + 0.5 * Math.sin(t * Math.PI));
      }
      data[idx + 3] = 255; // Alpha
    }
  }

  ctx.putImageData(imageData, 0, 0);
}

shBuildButton.addEventListener("click", drawShFractal);

// Initialize with black canvas
ctx.fillStyle = "#171717";
ctx.fillRect(0, 0, canvas.width, canvas.height);
// Початкове очищення
clearAll();
