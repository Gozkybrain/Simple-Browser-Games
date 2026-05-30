import { initAuthBox } from "./auth.js";

// Run when the page is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    initAuthBox(); 
});

// Set how many times a user can replay the game
let replayCount = 0;
const maxReplays = 3; // 3 tries max
let carriedScore = 0; // Keeps score between rounds


// This object stores all info about the game's state
const game = {
    canvas: null,
    ctx: null,
    snake: [],
    direction: { x: 0, y: 1 }, // Snake starts moving down
    food: { x: 0, y: 0 },
    score: 0,
    gameRunning: false,
    gamePaused: false,
    gridSize: 20,  // Size of each square
    tileCount: 20, // Number of tiles across (will be set later)
}

// These help with swipe controls on phones or tablets
let touchStartX = 0
let touchStartY = 0

// Start game setup when page loads
document.addEventListener("DOMContentLoaded", () => {
    initializeGame();      // Set up canvas and game state
    setupEventListeners(); // Set up keyboard and touch controls
})

// Setup the canvas size and snake
function initializeGame() {
    game.canvas = document.getElementById("gameCanvas");
    game.ctx = game.canvas.getContext("2d");

    // Set the canvas size to fit different screen sizes
    const size = Math.min(400, window.innerWidth * 0.9, window.innerHeight * 0.6);
    game.canvas.width = size;
    game.canvas.height = size;

    // Figure out how many tiles fit in the canvas
    game.tileCount = Math.floor(size / game.gridSize);

    resetGame(); // Place the snake and food
}

// Set up keyboard and touchscreen controls
function setupEventListeners() {
    document.addEventListener("keydown", handleKeyPress);

    // On-screen arrow buttons
    document.querySelectorAll(".control-btn").forEach(btn => {
        btn.addEventListener("click", () => changeDirection(btn.dataset.direction));
    });

    // For mobile swipe
    game.canvas.addEventListener("touchstart", handleTouchStart, { passive: false });
    game.canvas.addEventListener("touchmove", handleTouchMove, { passive: false });

    // Prevent scrolling while playing on mobile
    document.addEventListener("touchmove", (e) => {
        if (game.gameRunning) e.preventDefault();
    }, { passive: false });
}

// Handle arrow keys
function handleKeyPress(e) {
    if (!game.gameRunning || game.gamePaused) return;

    switch (e.key) {
        case "ArrowUp": changeDirection("up"); break;
        case "ArrowDown": changeDirection("down"); break;
        case "ArrowLeft": changeDirection("left"); break;
        case "ArrowRight": changeDirection("right"); break;
    }
}

// Store where the finger touches the screen
function handleTouchStart(e) {
    e.preventDefault();
    const touch = e.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
}

// Detect swipe direction and move the snake
function handleTouchMove(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const diffX = touchStartX - touch.clientX;
    const diffY = touchStartY - touch.clientY;

    if (Math.abs(diffX) > Math.abs(diffY)) {
        diffX > 0 ? changeDirection("left") : changeDirection("right");
    } else {
        diffY > 0 ? changeDirection("up") : changeDirection("down");
    }

    touchStartX = 0;
    touchStartY = 0;
}

// Change the snake's direction
function changeDirection(newDirection) {
    const dir = {
        up: { x: 0, y: -1 },
        down: { x: 0, y: 1 },
        left: { x: -1, y: 0 },
        right: { x: 1, y: 0 },
    }[newDirection];

    // Prevent the snake from turning into itself
    if (dir.x === -game.direction.x && dir.y === -game.direction.y) return;

    game.direction = dir;
}

// Reset the game to the starting state
function resetGame() {
    const centerX = Math.floor(game.tileCount / 2);
    const centerY = Math.floor(game.tileCount / 2);

    game.snake = [
        { x: centerX, y: centerY },
        { x: centerX, y: centerY - 1 },
        { x: centerX, y: centerY - 2 },
    ];

    game.direction = { x: 0, y: 1 }; // Moving down
    game.score = carriedScore;      // Continue from last score if replaying
    game.gameRunning = false;
    game.gamePaused = false;

    generateFood();
    updateScore();
}

// Place food at a random location
function generateFood() {
    do {
        game.food = {
            x: Math.floor(Math.random() * game.tileCount),
            y: Math.floor(Math.random() * game.tileCount),
        };
    } while (game.snake.some(s => s.x === game.food.x && s.y === game.food.y));
}

// Show the score on the screen
function updateScore() {
    document.getElementById("score").textContent = game.score;
}

// Main game loop
function gameLoop() {
    if (!game.gameRunning || game.gamePaused) return;

    update(); // Move snake, check collisions
    draw();   // Draw everything

    setTimeout(gameLoop, 300); // Call again in 300ms
}

// Move the snake forward, check for eating food or hitting wall
function update() {
    const head = { ...game.snake[0] };
    head.x += game.direction.x;
    head.y += game.direction.y;

    // Check wall or self collision
    if (
        head.x < 0 || head.x >= game.tileCount ||
        head.y < 0 || head.y >= game.tileCount ||
        game.snake.some(s => s.x === head.x && s.y === head.y)
    ) {
        gameOver();
        return;
    }

    game.snake.unshift(head); // Move head forward

    // If eating food
    if (head.x === game.food.x && head.y === game.food.y) {
        game.score += 1;
        updateScore();
        generateFood();
        createParticleEffect(head.x * game.gridSize, head.y * game.gridSize);
    } else {
        game.snake.pop(); // Remove tail if not eating
    }
}

// Draw everything on the canvas
function draw() {
    const g = game;
    const ctx = g.ctx;

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, g.canvas.width, g.canvas.height);
    gradient.addColorStop(0, "rgba(0, 0, 20, 0.8)");
    gradient.addColorStop(1, "rgba(20, 0, 40, 0.8)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, g.canvas.width, g.canvas.height);

    // Draw snake with glowing segments
    g.snake.forEach((segment, i) => {
        const x = segment.x * g.gridSize;
        const y = segment.y * g.gridSize;

        ctx.shadowColor = "#00ffff";
        ctx.shadowBlur = i === 0 ? 20 : 10;
        ctx.fillStyle = `rgba(0, 255, 255, ${1 - i / g.snake.length * 0.5})`;
        ctx.fillRect(x + 2, y + 2, g.gridSize - 4, g.gridSize - 4);
    });

    // Draw glowing food
    const fx = g.food.x * g.gridSize;
    const fy = g.food.y * g.gridSize;
    const pulseSize = Math.sin(Date.now() * 0.01) * 3 + g.gridSize - 4;

    ctx.shadowColor = "#ff00ff";
    ctx.shadowBlur = 25;
    ctx.fillStyle = "#ff00ff";
    ctx.beginPath();
    ctx.arc(fx + g.gridSize / 2, fy + g.gridSize / 2, pulseSize / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
}

// Fun effect when eating food
function createParticleEffect(x, y) {
    const particles = Array.from({ length: 8 }).map(() => ({
        x: x + game.gridSize / 2,
        y: y + game.gridSize / 2,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10,
        life: 30,
    }));

    function animateParticles() {
        game.ctx.save();
        particles.forEach((p, i) => {
            if (p.life <= 0) {
                particles.splice(i, 1);
                return;
            }
            p.x += p.vx;
            p.y += p.vy;
            p.life--;
            const alpha = p.life / 30;
            game.ctx.fillStyle = `rgba(255, 0, 255, ${alpha})`;
            game.ctx.fillRect(p.x, p.y, 3, 3);
        });
        game.ctx.restore();

        if (particles.length > 0) requestAnimationFrame(animateParticles);
    }

    animateParticles();
}

// When game ends
function gameOver() {
    game.gameRunning = false;
    document.getElementById("finalScore").textContent = game.score;
    document.getElementById("gameOverModal").classList.remove("hidden");

    replayCount++;
    carriedScore = game.score;

    const playAgainBtn = document.querySelector(".modal-buttons button.secondary");
    if (replayCount >= maxReplays) {
        playAgainBtn.classList.add("hidden");
    } else {
        playAgainBtn.classList.remove("hidden");
    }
}

// 🔒 Import Firebase stuff for saving score
import { auth, db } from "./firebase.js";
import {
    doc,
    getDoc,
    runTransaction,
    serverTimestamp,
    arrayRemove,
    arrayUnion
} from "firebase/firestore";

// Start the game, but only if user is signed in and allowed
async function startGame() {
    const user = auth.currentUser;
    if (!user) {
        alert("Please sign in to play.");
        return;
    }

    try {
        const userDocRef = doc(db, "geeks", user.uid);
        const userSnap = await getDoc(userDocRef);

        if (!userSnap.exists()) {
            alert("User data not found. Please complete registration.");
            return;
        }

        const data = userSnap.data();

        if (data.group !== "activated") {
            alert("Your account is not activated. Please activate to play.");
            return;
        }

        // All good! Start the game
        document.getElementById("mainMenu").classList.add("hidden");
        document.getElementById("gameContainer").classList.remove("hidden");

        resetGame();
        game.gameRunning = true;
        gameLoop();

    } catch (err) {
        console.error("Error checking user status:", err);
        alert("Something went wrong. Try again later.");
    }
}

// Play again
function restartGame() {
    document.getElementById("gameOverModal").classList.add("hidden");
    startGame();
}

// Show main menu
function showMainMenu() {
    document.getElementById("mainMenu").classList.remove("hidden");
    document.getElementById("gameContainer").classList.add("hidden");
    document.getElementById("leaderboard").classList.add("hidden");
    document.getElementById("instructions").classList.add("hidden");
    document.getElementById("gameOverModal").classList.add("hidden");
}

// Show top scores
function showLeaderboard() {
    document.getElementById("mainMenu").classList.add("hidden");
    document.getElementById("leaderboard").classList.remove("hidden");
    loadLeaderboard();
}

// Show instructions screen
function showInstructions() {
    document.getElementById("mainMenu").classList.add("hidden");
    document.getElementById("instructions").classList.remove("hidden");
}

// Pause/resume game
function togglePause() {
    if (!game.gameRunning) return;

    game.gamePaused = !game.gamePaused;
    document.querySelector(".pause-btn").textContent = game.gamePaused ? "▶️" : "⏸️";

    if (!game.gamePaused) gameLoop();
}

// Save score to database
async function submitScore() {
    const user = auth.currentUser;
    if (!user) {
        alert("Not signed in");
        return;
    }

    const geekDocRef = doc(db, "geeks", user.uid);

    try {
        await runTransaction(db, async (t) => {
            const docSnap = await t.get(geekDocRef);
            if (!docSnap.exists()) throw "Geek doc does not exist!";

            const data = docSnap.data();
            const txArr = data.transactions || [];
            const todayStr = new Date().toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric"
            });

            let snakeTx = txArr.find(tx => tx.account === "Snake");

            // No existing Snake score → create one
            if (!snakeTx) {
                snakeTx = {
                    account: "Snake",
                    amount: 0,
                    type: "credit",
                    date: todayStr
                };

                await t.update(geekDocRef, {
                    transactions: arrayUnion({ ...snakeTx, amount: game.score })
                });
            } else {
                // Update existing score
                const newBalance = (snakeTx.amount ?? 0) + game.score;

                const updatedSnakeTx = {
                    ...snakeTx,
                    amount: newBalance,
                    date: todayStr
                };

                t.update(geekDocRef, {
                    transactions: arrayRemove(snakeTx)
                });
                t.update(geekDocRef, {
                    transactions: arrayUnion(updatedSnakeTx)
                });
            }
        });

        alert("Score added to your Snake balance!");

        document.getElementById("gameContainer").classList.add("hidden");
        document.getElementById("gameOverModal").classList.add("hidden");

        setTimeout(() => {
            showLeaderboard();
        }, 200);

    } catch (e) {
        console.error("Transaction failed:", e);
        alert("Failed to update Snake balance.");
    }
}

// Load and show scores
async function loadLeaderboard() {
    const leaderboardList = document.getElementById("leaderboardList");

    try {
        if (window.firebaseReady) {
            const scores = await window.getLeaderboardFromFirebase();
            displayLeaderboard(scores);
        } else {
            leaderboardList.innerHTML = `
                <p>🚀 You've reached your play limit for today.</p>
                <p>🌌 Please come back tomorrow to continue your galactic journey.</p>
            `;
        }
    } catch (e) {
        console.error("Error loading leaderboard:", e);
        leaderboardList.innerHTML = "<div class='loading'>Error loading scores</div>";
    }
}

// Show top players in the leaderboard
function displayLeaderboard(scores) {
    const list = document.getElementById("leaderboardList");

    if (!scores || scores.length === 0) {
        list.innerHTML = "<div class='loading'>No scores yet</div>";
        return;
    }

    list.innerHTML = scores.map((s, i) => `
    <div class="leaderboard-item">
        <span class="leaderboard-rank">#${i + 1}</span>
        <span class="leaderboard-name">${s.name}</span>
        <span class="leaderboard-score">${s.score}</span>
    </div>`).join("");
}

// Resize canvas if the screen size changes
window.addEventListener("resize", () => {
    if (game.canvas) {
        const size = Math.min(400, window.innerWidth * 0.9, window.innerHeight * 0.6);
        game.canvas.width = size;
        game.canvas.height = size;
        game.tileCount = Math.floor(size / game.gridSize);
    }
});

// Export functions so other scripts can use them
export {
    startGame,
    showMainMenu,
    restartGame,
    submitScore,
    showLeaderboard,
    showInstructions,
    togglePause,
}
