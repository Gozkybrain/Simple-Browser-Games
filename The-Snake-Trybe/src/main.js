import "./style.css";
import "./firebase.js";
import {
  startGame,
  showMainMenu,
  restartGame,
  submitScore,
  showLeaderboard,
  showInstructions,
  togglePause
} from "./game.js";
import { checkPlayAllowed } from "./auth.js";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase.js";

// Load dashboard redirect URL from environment variable
const DASHBOARD_URL = import.meta.env.VITE_DASHBOARD_URL;



document.addEventListener("DOMContentLoaded", () => {
  // Monitor authentication state
  onAuthStateChanged(auth, async (user) => {
    const startBtn = document.getElementById("start-button");
    const mainMenu = document.getElementById("mainMenu");
    const menuContent = mainMenu?.querySelector(".menu-content");

    // Handle unauthenticated users
    if (!user) {
      console.log("User not signed in, hiding play button.");
      if (startBtn) startBtn.style.display = "none";

      if (menuContent) {
        const message = document.createElement("div");
        message.innerHTML = `<p>You are not signed in. Please sign in to play.</p>`;
        menuContent.appendChild(message);

        const backBtn = document.getElementById("back-to-dashboard");
        if (backBtn) {
          backBtn.addEventListener("click", () => {
            window.location.href = DASHBOARD_URL;
          });
        }
      }
      return;
    }

    // Check if the user has already played today
    const allowed = await checkPlayAllowed();
    console.log("Play allowed?", allowed);

    if (!allowed) {
      if (startBtn) startBtn.style.display = "none";

      if (menuContent) {
        const message = document.createElement("div");
        message.innerHTML = `
          <p>You have already played today. Come back tomorrow.</p>
          <button id="back-to-dashboard" class="neon-button">Go Back to Dashboard</button>
        `;
        menuContent.appendChild(message);

        const backBtn = document.getElementById("back-to-dashboard");
        if (backBtn) {
          backBtn.addEventListener("click", () => {
            window.location.href = DASHBOARD_URL;
          });
        }
      }
    } else {
      // Show and bind Start Game button if eligible
      if (startBtn) {
        startBtn.style.display = "inline-block";
        startBtn.addEventListener("click", startGame);
      }
    }
  });

  // Bind static UI buttons to handlers
  const leaderboardBtn = document.getElementById("leaderboard-button");
  if (leaderboardBtn) leaderboardBtn.addEventListener("click", showLeaderboard);

  const instructionsBtn = document.getElementById("instructions-button");
  if (instructionsBtn) instructionsBtn.addEventListener("click", showInstructions);

  const leaderboardBackBtn = document.getElementById("leaderboard-back-button");
  if (leaderboardBackBtn) leaderboardBackBtn.addEventListener("click", showMainMenu);

  const instructionsBackBtn = document.getElementById("instructions-back-button");
  if (instructionsBackBtn) instructionsBackBtn.addEventListener("click", showMainMenu);

  const pauseBtn = document.getElementById("pause-button");
  if (pauseBtn) pauseBtn.addEventListener("click", togglePause);

  // Prevent multiple rapid clicks during score submission
  const submitScoreBtn = document.getElementById("submit-score-button");
  if (submitScoreBtn) {
    submitScoreBtn.addEventListener("click", async () => {
      submitScoreBtn.disabled = true;
      submitScoreBtn.textContent = "Submitting...";

      try {
        await submitScore();
      } finally {
        submitScoreBtn.disabled = false;
        submitScoreBtn.textContent = "Submit Score";
      }
    });
  }

  const playAgainBtn = document.getElementById("play-again-button");
  if (playAgainBtn) playAgainBtn.addEventListener("click", restartGame);
});
