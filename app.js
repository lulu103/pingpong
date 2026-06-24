const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// resize
function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

// paddle settings
const paddleWidth = 12;
const paddleHeight = 160;

// left AI paddle
let leftY = canvas.height / 2;

// right player paddle
let rightY = canvas.height / 2;

// ball
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballVX = 6;
let ballVY = 4;
const ballR = 10;

// 🎯 AI settings
const aiSpeed = 0.08; // 越大越強 (0.05 easy, 0.12 hard)

// draw loop
function draw() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // ======================
  // AI (LEFT PADDLE)
  // ======================
  leftY += (ballY - leftY - paddleHeight / 2) * aiSpeed;

  // ======================
  // PLAYER (RIGHT PADDLE)
  // ======================
  // mouse/touch already controls rightY

  // ======================
  // DRAW PADDLES
  // ======================
  ctx.fillStyle = "white";

  // left AI
  ctx.fillRect(20, leftY, paddleWidth, paddleHeight);

  // right player
  ctx.fillRect(canvas.width - 30, rightY, paddleWidth, paddleHeight);

  // ======================
  // BALL
  // ======================
  ctx.beginPath();
  ctx.arc(ballX, ballY, ballR, 0, Math.PI * 2);
  ctx.fill();

  // move ball
  ballX += ballVX;
  ballY += ballVY;

  // top / bottom bounce
  if (ballY < 0 || ballY > canvas.height) {
    ballVY *= -1;
  }

  // ======================
  // COLLISION (LEFT)
  // ======================
  if (
    ballX < 30 &&
    ballY > leftY &&
    ballY < leftY + paddleHeight
  ) {
    ballVX *= -1;

    // add angle control
    ballVY = (ballY - (leftY + paddleHeight / 2)) * 0.2;
  }

  // ======================
  // COLLISION (RIGHT)
  // ======================
  if (
    ballX > canvas.width - 30 &&
    ballY > rightY &&
    ballY < rightY + paddleHeight
  ) {
    ballVX *= -1;

    // add angle control
    ballVY = (ballY - (rightY + paddleHeight / 2)) * 0.2;
  }

  // ======================
  // RESET BALL
  // ======================
  if (ballX < 0 || ballX > canvas.width) {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballVX *= -1;
  }

  requestAnimationFrame(draw);
}
draw();

// ======================
// CONTROLS (RIGHT PADDLE)
// ======================
document.addEventListener("mousemove", (e) => {
  rightY = e.clientY - paddleHeight / 2;
});

document.addEventListener("touchmove", (e) => {
  rightY = e.touches[0].clientY - paddleHeight / 2;
});