// src/auth.js
import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

// Dashboard redirect URL from environment variable
const DASHBOARD_URL = import.meta.env.VITE_DASHBOARD_URL;

/**
 * Dynamically fills all elements with the given auth box class
 * with user profile info or a sign-in prompt.
 */
export function initAuthBox(authBoxClass = "auth-box") {
  const authBoxes = document.getElementsByClassName(authBoxClass);

  if (!authBoxes.length) {
    console.warn(`[auth.js] No elements found with class '${authBoxClass}'.`);
    return;
  }

  // authentication state changes
  onAuthStateChanged(auth, async (user) => {
    for (const authBox of authBoxes) {
      if (!user) {
        // Show login prompt if user is not signed in
        authBox.innerHTML = `
          <p>You are not signed in.</p>
          <a href="${DASHBOARD_URL}" target="_blank" rel="noopener noreferrer">
            <button class="neon-button">Click here to sign in now</button>
          </a>
        `;
        continue;
      }

      // Attempt to load and display Firestore user data
      try {
        const userDocRef = doc(db, "geeks", user.uid);
        const userSnap = await getDoc(userDocRef);

        if (userSnap.exists()) {
          const data = userSnap.data();
          authBox.innerHTML = `
            <img src="${data.profilePictureUrl || ""}" alt="Profile Picture" class="image-dp">
            <h2>${data.fullName || "User"}</h2>
          `;
        } else {
          authBox.innerHTML = `<p>User data not found in Firestore.</p>`;
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        authBox.innerHTML = `<p>Error loading user info.</p>`;
      }
    }
  });
}

/**
 * Determines whether the current user is eligible to play today.
 * Limits gameplay to once per day based on their latest transaction.
 */
export async function checkPlayAllowed() {
  const user = auth.currentUser;
  if (!user) {
    console.log("No user signed in → disallow play");
    return false;
  }

  const userDocRef = doc(db, "geeks", user.uid);
  const userSnap = await getDoc(userDocRef);

  if (!userSnap.exists()) {
    console.log("No 'geeks' doc → allow play");
    return true;
  }

  const data = userSnap.data();
  const txArr = Array.isArray(data.transactions) ? data.transactions : [];

  // Look for a Snake transaction (score submission)
  const snakeTx = txArr.find(tx => tx.account === "Snake");

  const today = new Date().toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric"
  });

  // If no previous Snake play or it's on a different day, allow play
  if (!snakeTx) return true;

  return snakeTx.date !== today;
}
