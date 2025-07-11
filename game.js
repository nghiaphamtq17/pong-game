const canvas = document.getElementById("pong");
const ctx = canvas.getContext("2d");

// Constants
const PADDLE_WIDTH = 15;
const PADDLE_HEIGHT = 100;
const BALL_SIZE = 15;
const PLAYER_X = 20;
const AI_X = canvas.width - PADDLE_WIDTH - 20;
const PADDLE_SPEED = 6;
const AI_SPEED = 4;

// State
let playerY = (canvas.height - PADDLE_HEIGHT) / 2;
let aiY = (canvas.height - PADDLE_HEIGHT) / 2;
let ballX = canvas.width / 2 - BALL_SIZE / 2;
let ballY = canvas.height / 2 - BALL_SIZE / 2;
let ballSpeedX = 5;
let ballSpeedY = 3;
let playerScore = 0;
let aiScore = 0;

// Mouse control
canvas.addEventListener("mousemove", function (e) {
  const rect = canvas.getBoundingClientRect();
  const mouseY = e.clientY - rect.top;
  playerY = mouseY - PADDLE_HEIGHT / 2;
  // Restrict paddle within bounds
  playerY = Math.max(0, Math.min(canvas.height - PADDLE_HEIGHT, playerY));
});

// Game loop
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

function update() {
  // Move ball
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  // Ball collision with top/bottom wall
  if (ballY <= 0) {
    ballY = 0;
    ballSpeedY *= -1;
  } else if (ballY + BALL_SIZE >= canvas.height) {
    ballY = canvas.height - BALL_SIZE;
    ballSpeedY *= -1;
  }

  // Ball collision with player paddle
  if (
    ballX <= PLAYER_X + PADDLE_WIDTH &&
    ballY + BALL_SIZE > playerY &&
    ballY < playerY + PADDLE_HEIGHT
  ) {
    ballX = PLAYER_X + PADDLE_WIDTH;
    ballSpeedX *= -1.1; // Reflect and slightly speed up
    // Adjust Y direction based on hit position
    let hitPos = ballY + BALL_SIZE / 2 - (playerY + PADDLE_HEIGHT / 2);
    ballSpeedY += hitPos * 0.15;
  }

  // Ball collision with AI paddle
  if (
    ballX + BALL_SIZE >= AI_X &&
    ballY + BALL_SIZE > aiY &&
    ballY < aiY + PADDLE_HEIGHT
  ) {
    ballX = AI_X - BALL_SIZE;
    ballSpeedX *= -1.1;
    let hitPos = ballY + BALL_SIZE / 2 - (aiY + PADDLE_HEIGHT / 2);
    ballSpeedY += hitPos * 0.15;
  }

  // Score check
  if (ballX < 0) {
    aiScore++;
    resetBall();
  } else if (ballX + BALL_SIZE > canvas.width) {
    playerScore++;
    resetBall();
  }

  // AI paddle movement (basic tracking)
  let botDifficulty = 10 - Math.min(aiScore, 8); // Dead zone nhỏ dần khi điểm cao
  let aiSpeedDynamic = AI_SPEED + aiScore * 0.7; // AI paddle move faster with higher score

  let aiCenter = aiY + PADDLE_HEIGHT / 2;
  if (aiCenter < ballY + BALL_SIZE / 2 - botDifficulty) {
    aiY += aiSpeedDynamic;
  } else if (aiCenter > ballY + BALL_SIZE / 2 + botDifficulty) {
    aiY -= aiSpeedDynamic;
  }
}

function resetBall() {
  ballX = canvas.width / 2 - BALL_SIZE / 2;
  ballY = canvas.height / 2 - BALL_SIZE / 2;
  // Randomize direction
  ballSpeedX = Math.random() > 0.5 ? 5 : -5;
  ballSpeedY = Math.random() > 0.5 ? 3 : -3;
}

function draw() {
  // Clear
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw middle line
  ctx.strokeStyle = "#fff";
  ctx.setLineDash([10]);
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.stroke();
  ctx.setLineDash([]);

  // Draw paddles
  ctx.fillStyle = "#fff";
  ctx.fillRect(PLAYER_X, playerY, PADDLE_WIDTH, PADDLE_HEIGHT);
  ctx.fillRect(AI_X, aiY, PADDLE_WIDTH, PADDLE_HEIGHT);

  // Draw ball
  ctx.fillRect(ballX, ballY, BALL_SIZE, BALL_SIZE);

  // Draw scores
  ctx.font = "36px Arial";
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.fillText(playerScore, canvas.width / 2 - 50, 50);
  ctx.fillText(aiScore, canvas.width / 2 + 50, 50);
}

// Start game
gameLoop();
