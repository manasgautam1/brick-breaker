const showBtn = document.querySelector(".show-rules");
const closeBtn = document.querySelector(".close");
const rulesEl = document.querySelector(".rules");

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let score = 0;
const bricksColumns = 5;
const bricksRows = 9;

showBtn.addEventListener("click", () => {
  rulesEl.classList.add("show");
});
closeBtn.addEventListener("click", () => {
  rulesEl.classList.remove("show");
});
document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

//BALL SPECS
const ball = {
  x: canvas.width / 2 - 5,
  y: canvas.height / 2 - 5,
  radius: 10,
  speed: 4,
  dx: 4,
  dy: -4,
};

//PADDLE SPECS
const paddle = {
  x: canvas.width / 2 - 40,
  y: canvas.height - 20,
  height: 10,
  width: 80,
  speed: 8,
  dx: 4,
};
//BRICKS SPECS
const brickSpec = {
  width: 70,
  height: 20,
  padding: 10,
  offsetX: 45,
  offsetY: 60,
  visibility: true,
};

//DRAW BALL
function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = "#0095dd";
  ctx.fill();
  ctx.closePath();
}

//DRAW PADDLE
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height);
  ctx.fillStyle = "#0095dd";
  ctx.fill();
  ctx.closePath();
}

//DRAW SCORE
function drawScore() {
  ctx.font = "20px Arial";
  ctx.fillText(`Score: ${score}`, canvas.width - 100, 30);
}

//DRAW BRICKS
const bricks = [];
for (let i = 0; i < bricksRows; i++) {
  bricks[i] = [];
  for (let j = 0; j < bricksColumns; j++) {
    let x = i * (brickSpec.width + brickSpec.padding) + brickSpec.offsetX;
    let y = j * (brickSpec.height + brickSpec.padding) + brickSpec.offsetY;

    bricks[i][j] = { x, y, ...brickSpec };
  }
}

function drawBricks() {
  bricks.forEach((column) => {
    column.forEach((brick) => {
      ctx.beginPath();
      ctx.rect(brick.x, brick.y, brick.width, brick.height);
      ctx.fillStyle = brick.visibility ? "#0095dd" : "transparent";
      ctx.fill();
      ctx.closePath();
    });
  });
}

//MOVE PADDLE
function movePaddle() {
  paddle.x += paddle.dx;
  if (paddle.x + paddle.width > canvas.width) {
    paddle.x = canvas.width - paddle.width;
  }

  if (paddle.x < 0) {
    paddle.x = 0;
  }
}
// Keydown event
function keyDown(e) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    paddle.dx = paddle.speed;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    paddle.dx = -paddle.speed;
  }
}

// Keyup event
function keyUp(e) {
  if (
    e.key === "Right" ||
    e.key === "ArrowRight" ||
    e.key === "Left" ||
    e.key === "ArrowLeft"
  ) {
    paddle.dx = 0;
  }
}
function moveBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;

  // Wall collision (right/left)
  if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
    ball.dx *= -1; // ball.dx = ball.dx * -1
  }

  // Wall collision (top/bottom)
  if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
    ball.dy *= -1;
  }

  // console.log(ball.x, ball.y);

  // Paddle collision
  if (
    ball.x - ball.radius > paddle.x &&
    ball.x + ball.radius < paddle.x + paddle.width &&
    ball.y + ball.radius > paddle.y
  ) {
    ball.dy = -ball.speed;
  }

  // Brick collision
  bricks.forEach((column) => {
    column.forEach((brick) => {
      if (brick.visibility) {
        if (
          ball.x - ball.radius > brick.x && // left brick side check
          ball.x + ball.radius < brick.x + brick.width && // right brick side check
          ball.y + ball.radius > brick.y && // top brick side check
          ball.y - ball.radius < brick.y + brick.height // bottom brick side check
        ) {
          ball.dy *= -1;
          brick.visibility = false;

          increaseScore();
        }
      }
    });
  });

  // Hit bottom wall - Lose
  if (ball.y + ball.radius > canvas.height) {
    showAllBricks();
    score = 0;
  }
}

function increaseScore() {
  score++;

  if (score % (bricksRows * bricksRows) === 0) {
    showAllBricks();
  }
}
function showAllBricks() {
  bricks.forEach((column) => {
    column.forEach((brick) => (brick.visibility = true));
  });
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBall();
  drawPaddle();
  drawScore();
  drawBricks();
}

function update() {
  movePaddle();
  moveBall();

  draw();

  requestAnimationFrame(update);
}
update();
