const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const overlay = document.getElementById("overlay");
const startBtn = document.getElementById("start-btn");

const GROUND_Y = 250;
const GRAVITY = 0.6;
const JUMP_FORCE = -12;

let player;
let obstacles;
let score;
let gameOver;
let gameStarted;
let animationId;
let frameCount;
let spawnInterval;

function initPlayer() {
    return {
        x: 80,
        y: GROUND_Y - 40,
        width: 30,
        height: 40,
        vy: 0,
        jumping: false
    };
}

function resetGame() {
    player = initPlayer();
    obstacles = [];
    score = 0;
    gameOver = false;
    frameCount = 0;
    spawnInterval = 90;
}

function jump() {
    if (!gameStarted || gameOver) return;
    if (!player.jumping) {
        player.vy = JUMP_FORCE;
        player.jumping = true;
    }
}

function spawnObstacle() {
    const height = 30 + Math.floor(Math.random() * 30);
    const width = 20 + Math.floor(Math.random() * 20);
    obstacles.push({
        x: canvas.width,
        y: GROUND_Y - height,
        width: width,
        height: height
    });
}

function updatePlayer() {
    player.vy += GRAVITY;
    player.y += player.vy;

    if (player.y >= GROUND_Y - player.height) {
        player.y = GROUND_Y - player.height;
        player.vy = 0;
        player.jumping = false;
    }
}

function updateObstacles() {
    for (let i = obstacles.length - 1; i >= 0; i--) {
        const o = obstacles[i];
        o.x -= 6;

        if (o.x + o.width < 0) {
            obstacles.splice(i, 1);
            score++;
        }
    }
}

function checkCollision() {
    for (let i = 0; i < obstacles.length; i++) {
        const o = obstacles[i];
        if (
            player.x < o.x + o.width &&
            player.x + player.width > o.x &&
            player.y < o.y + o.height &&
            player.y + player.height > o.y
        ) {
            return true;
        }
    }
    return false;
}

function drawGround() {
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, GROUND_Y);
    ctx.lineTo(canvas.width, GROUND_Y);
    ctx.stroke();
}

function drawPlayer() {
    ctx.fillStyle = "#4a6fa5";
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawObstacles() {
    ctx.fillStyle = "#b04040";
    for (let i = 0; i < obstacles.length; i++) {
        const o = obstacles[i];
        ctx.fillRect(o.x, o.y, o.width, o.height);
    }
}

function drawScore() {
    ctx.fillStyle = "#333";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 20, 30);
}

function drawGameOver() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.font = "36px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2 - 20);
    ctx.font = "22px Arial";
    ctx.fillText("Score: " + score, canvas.width / 2, canvas.height / 2 + 20);
    ctx.fillText("Press SPACE to try again", canvas.width / 2, canvas.height / 2 + 60);
    ctx.textAlign = "left";
}

function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!gameOver) {
        updatePlayer();
        updateObstacles();

        frameCount++;
        if (frameCount % spawnInterval === 0) {
            spawnObstacle();
        }

        if (checkCollision()) {
            gameOver = true;
        }
    }

    drawGround();
    drawObstacles();
    drawPlayer();
    drawScore();

    if (gameOver) {
        drawGameOver();
        gameStarted = false;
        return;
    }

    animationId = requestAnimationFrame(loop);
}

function startGame() {
    cancelAnimationFrame(animationId);
    resetGame();
    gameStarted = true;
    overlay.classList.add("hidden");
    loop();
}

document.addEventListener("keydown", function (e) {
    if (e.code === "Space") {
        e.preventDefault();
        if (gameOver) {
            startGame();
        } else if (!gameStarted) {
            startGame();
        } else {
            jump();
        }
    }
});
startBtn.addEventListener("click", startGame);

resetGame();
ctx.clearRect(0, 0, canvas.width, canvas.height);
drawGround();
drawPlayer();
drawScore();