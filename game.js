const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const player = {
    x: 50,
    y: canvas.height / 2 - 25,
    width: 50,
    height: 50,
    speed: 5,
    color: "blue"
};

const bullets = [];
const enemies = [];
let score = 0;
let gameOver = false;

// Điều khiển
const keys = {};
document.addEventListener("keydown", (e) => {
    keys[e.key] = true;
    if (e.key === " ") shoot();
});
document.addEventListener("keyup", (e) => {
    keys[e.key] = false;
});

function shoot() {
    bullets.push({
        x: player.x + player.width,
        y: player.y + player.height / 2 - 5,
        width: 10,
        height: 5,
        speed: 8,
        color: "white"
    });
}

function spawnEnemy() {
    const size = 40;
    enemies.push({
        x: canvas.width,
        y: Math.random() * (canvas.height - size),
        width: size,
        height: size,
        speed: 3,
        color: "red"
    });
}

function update() {
    if (gameOver) return;

    // Di chuyển người chơi
    if (keys["ArrowUp"] && player.y > 0) player.y -= player.speed;
    if (keys["ArrowDown"] && player.y + player.height < canvas.height) player.y += player.speed;

    // Di chuyển đạn
    bullets.forEach((b, i) => {
        b.x += b.speed;
        if (b.x > canvas.width) bullets.splice(i, 1);
    });

    // Di chuyển kẻ địch
    enemies.forEach((e, ei) => {
        e.x -= e.speed;
        if (e.x + e.width < 0) {
            enemies.splice(ei, 1);
        }

        // Va chạm với người chơi
        if (
            e.x < player.x + player.width &&
            e.x + e.width > player.x &&
            e.y < player.y + player.height &&
            e.y + e.height > player.y
        ) {
            gameOver = true;
        }

        // Kiểm tra va chạm với đạn
        bullets.forEach((b, bi) => {
            if (
                b.x < e.x + e.width &&
                b.x + b.width > e.x &&
                b.y < e.y + e.height &&
                b.y + b.height > e.y
            ) {
                enemies.splice(ei, 1);
                bullets.splice(bi, 1);
                score++;
            }
        });
    });
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Vẽ người chơi
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Vẽ đạn
    bullets.forEach(b => {
        ctx.fillStyle = b.color;
        ctx.fillRect(b.x, b.y, b.width, b.height);
    });

    // Vẽ kẻ địch
    enemies.forEach(e => {
        ctx.fillStyle = e.color;
        ctx.fillRect(e.x, e.y, e.width, e.height);
    });

    // Vẽ điểm
    ctx.fillStyle = "white";
    ctx.font = "24px sans-serif";
    ctx.fillText("Score: " + score, 10, 30);

    // Game Over
    if (gameOver) {
        ctx.fillStyle = "red";
        ctx.font = "48px sans-serif";
        ctx.fillText("GAME OVER", canvas.width / 2 - 140, canvas.height / 2);
    }
}

let enemySpawnCounter = 0;
function gameLoop() {
    update();
    draw();

    if (!gameOver) {
        enemySpawnCounter++;
        if (enemySpawnCounter > 60) {
            spawnEnemy();
            enemySpawnCounter = 0;
        }
        requestAnimationFrame(gameLoop);
    }
}

gameLoop();
