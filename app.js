const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// paddle
const paddleHeight = 120;
const paddleWidth = 10;

let leftY = canvas.height / 2;
let rightY = canvas.height / 2;

// ball
let x = canvas.width / 2;
let y = canvas.height / 2;
let vx = 6;
let vy = 4;
let radius = 10;

function draw() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // paddles
  ctx.fillStyle = "white";
  ctx.fillRect(20, leftY, paddleWidth, paddleHeight);
  ctx.fillRect(canvas.width - 30, rightY, paddleWidth, paddleHeight);

  // ball
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();

  // move ball
  x += vx;
  y += vy;

  // bounce top/bottom
  if (y < 0 || y > canvas.height) vy *= -1;

  // paddle collision
  if (x < 30 && y > leftY && y < leftY + paddleHeight) vx *= -1;
  if (x > canvas.width - 30 && y > rightY && y < rightY + paddleHeight) vx *= -1;

  // reset
  if (x < 0 || x > canvas.width) {
    x = canvas.width / 2;
    y = canvas.height / 2;
  }

  requestAnimationFrame(draw);
}

draw();

// controls
document.addEventListener("mousemove", e => {
  rightY = e.clientY - paddleHeight / 2;
});

document.addEventListener("touchmove", e => {
  rightY = e.touches[0].clientY - paddleHeight / 2;
});