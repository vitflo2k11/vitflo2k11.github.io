const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
const mobileControls = document.getElementById("mobile-controls");
if (isMobile) {
    mobileControls.classList.remove("hidden");
}

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

const player = {
    x: WIDTH / 2 - 25,
    y: HEIGHT - 70,
    width: 50,
    height: 50,
    speed: 5,
    color: "blue"
};

const bullets = [];
const enemies = [];
let score = 0;
let gameOver = false;

const keys = {};

if (!isMobile) {
    document.addEventListener("keydown", (e) => {
        keys[e.key] = true;
        if (e.key === " ") shoot();
    });
    document.addEventListener("keyup", (e) => {
        keys[e.key] = false;
    });
} else {
    document.getElementById("btn-left").addEventListener("touchstart", () => keys["ArrowLeft"] = true);
    document.getElementById("btn-left").addEventListener("touchend", () => keys["ArrowLeft"] = false);

    document.getElementById("btn-right").addEventListener("touchstart", () => keys["ArrowRight"] = true);
    document.getElementById("btn-right").addEventListener("touchend", () => keys["ArrowRight"] = false);

    document.getElementById("btn-shoot").addEventListener("touchstart", shoot);
}

function shoot() {
    bullets.push({
        x: player.x + player.width / 2 - 3,
        y: player.y,
        width: 6,
        height: 10,
        speed: 7,
        color: "white"
    });
}

function spawnEnemy() {
    const size = 40;
    enemies.push({
        x: Math.random() * (WIDTH - size),
        y: -size,
        width: size,
        height: size,
        speed: 2 + Math.random() * 2,
        color: "red"
    });
}

function update() {
    if (gameOver) return;

    // Di chuyển người chơi
    if (keys["ArrowLeft"] && player.x > 0) player.x -= player.speed;
    if (keys["ArrowRight"] && player.x + player.width < WIDTH) player.x += player.speed;

    // Di chuyển đạn lên trên
    bullets.forEach((b, i) => {
        b.y -= b.speed;
        if (b.y + b.height < 0) bullets.splice(i, 1);
    });

    // Kẻ địch rơi xuống
    enemies.forEach((e, ei) => {
        e.y += e.speed;

        if (e.y > HEIGHT) {
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

        if (e.y + e.height >= HEIGHT) {
            gameOver = true; // Thua nếu địch chạm đáy
        }

        // Va chạm với đạn
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
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);

    bullets.forEach(b => {
        ctx.fillStyle = b.color;
        ctx.fillRect(b.x, b.y, b.width, b.height);
    });

    enemies.forEach(e => {
        ctx.fillStyle = e.color;
        ctx.fillRect(e.x, e.y, e.width, e.height);
    });

    ctx.fillStyle = "white";
    ctx.font = "20px sans-serif";
    ctx.fillText("Score: " + score, 10, 30);

    if (gameOver) {
        ctx.fillStyle = "red";
        ctx.font = "36px sans-serif";
        ctx.fillText("GAME OVER", WIDTH / 2 - 100, HEIGHT / 2);
    }
}

let enemyTimer = 0;
function gameLoop() {
    update();
    draw();

    if (!gameOver) {
        enemyTimer++;
        if (enemyTimer > 50) {
            spawnEnemy();
            enemyTimer = 0;
        }
        requestAnimationFrame(gameLoop);
    }
}

gameLoop();
