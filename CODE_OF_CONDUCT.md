# Developer Approach and Setup

This document covers how to get this project running locally and the rules for adding new content.

## Setup and Installation

1. Clone the repository:
   git clone https://github.com/Gozkybrain/Simple-Browser-Games.git

2. Navigate to the directory:
   cd Simple-Browser-Games

3. Run it:
   Since this is a static collection, there are no dependencies to install. Just open index.html in your browser.

## Project Structure

- / : The root contains the master index.html (the arcade hub).
- /[game_name] : Each directory contains a standalone game.
- /assets : Shared assets for the main hub.
- /icons : Icons used for the project.

## Adding a New Game

To add a new game to the collection:
1. Create a new folder for the game.
2. Ensure the game has a self-contained index.html.
3. Open the root index.html and add a new "game-card" div inside the "game-grid" section.
4. Use the following template for the card:

```html
<div class="game-card" onclick="window.location.href='folder_name/index.html'">
    <div class="corner top-left"></div><div class="corner top-right"></div>
    <div class="corner bottom-left"></div><div class="corner bottom-right"></div>
    <div class="card-content">
        <h3 class="game-title">Game Name</h3>
        <p class="game-desc">A brief, witty description of the game.</p>
    </div>
</div>
```

## Documentation Standards

- Keep README.md updated with the full list of games.
- No emojis in markdown files.
- Stick to Vanilla HTML, CSS, and Javascript.
