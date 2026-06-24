const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// resize
function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

// paddles
const paddleWidth = 12;
const paddleHeight = 160;

let leftY = canvas.height / 2;
let rightY = canvas.height / 2;

// ball
let ballX, ballY, ballVX, ballVY;
const ballR = 10;

// score
let leftScore = 0;
let rightScore = 0;
const winScore = 5;

// AI difficulty (dynamic)
let aiSpeed = 0.08;

// game state
let gameOver = false;
let winner = "";

// reset ball
function resetBall(direction = 1) {
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;

  ballVX = 6 * direction;
  ballVY = (Math.random() * 4 - 2);
}

resetBall(1);

// draw text
function drawText() {
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.textAlign = "center";

  ctx.fillText(leftScore, canvas.width / 4, 50);
  ctx.fillText(rightScore, canvas.width * 3 / 4, 50);

  if (gameOver) {
    ctx.font = "40px Arial";
    ctx.fillText(`${winner} Wins!`, canvas.width / 2, canvas.height / 2);
    ctx.font = "20px Arial";
    ctx.fillText("Tap / Click to Restart", canvas.width / 2, canvas.height / 2 + 40);
  }
}

// collision helper
function hit(paddleY, x) {
  return (
    ballY > paddleY &&
    ballY < paddleY + paddleHeight &&
    x
  );
}

// restart
function restart() {
  leftScore = 0;
  rightScore = 0;
  gameOver = false;
  aiSpeed = 0.08;
  resetBall(1);
}

document.addEventListener("click", () => {
  if (gameOver) restart();
});

// controls
document.addEventListener("mousemove", (e) => {
  rightY = e.clientY - paddleHeight / 2;
});

document.addEventListener("touchmove", (e) => {
  rightY = e.touches[0].clientY - paddleHeight / 2;
});

function draw() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawText();

  if (gameOver) {
    requestAnimationFrame(draw);
    return;
  }

  // ======================
  // AI (LEFT)
  // smarter + imperfect
  let error = (Math.random() - 0.5) * 20;
  leftY += (ballY - leftY - paddleHeight / 2 + error) * aiSpeed;

  // ======================
  // BALL MOVE
  ballX += ballVX;
  ballY += ballVY;

  // top/bottom bounce
  if (ballY < 0 || ballY > canvas.height) {
    ballVY *= -1;
  }

  // ======================
  // LEFT HIT
  if (
    ballX < 30 &&
    ballY > leftY &&
    ballY < leftY + paddleHeight
  ) {
    ballVX *= -1;
    ballVY = (ballY - (leftY + paddleHeight / 2)) * 0.2;
  }

  // ======================
  // RIGHT HIT
  if (
    ballX > canvas.width - 30 &&
    ballY > rightY &&
    ballY < rightY + paddleHeight
  ) {
    ballVX *= -1;
    ballVY = (ballY - (rightY + paddleHeight / 2)) * 0.2;
  }

  // ======================
  // SCORE LEFT (AI missed)
  if (ballX > canvas.width) {
    leftScore++;
    resetBall(-1);
  }

  // SCORE RIGHT (player missed)
  if (ballX < 0) {
    rightScore++;
    resetBall(1);
  }

  // ======================
  // WIN CHECK
  if (leftScore >= winScore) {
    gameOver = true;
    winner = "AI";
  }

  if (rightScore >= winScore) {
    gameOver = true;
    winner = "Player";
  }

  // ======================
  // DRAW PADDLES
  ctx.fillStyle = "white";
  ctx.fillRect(20, leftY, paddleWidth, paddleHeight);
  ctx.fillRect(canvas.width - 30, rightY, paddleWidth, paddleHeight);

  // ball
  ctx.beginPath();
  ctx.arc(ballX, ballY, ballR, 0, Math.PI * 2);
  ctx.fill();

  requestAnimationFrame(draw);
}

draw();