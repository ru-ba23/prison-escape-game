# Prison Escape — JavaScript + Phaser 3

A browser-based 2D arcade escape game rebuilt from the original Python/Pyodide version. It uses Phaser 3.80.1.

## Run the game

1. Extract the ZIP file.
2. Open a terminal in this folder.
3. Start a local web server:
   - Python installed: `python -m http.server 8000`
   - Or use the VS Code Live Server extension.
4. Open `http://localhost:8000` in your browser.

Do not open `index.html` directly as a `file://` URL because JavaScript ES modules and assets need to be served over HTTP.

## Controls

- Move: Arrow keys or W/A/S/D.
- Collect the yellow key.
- Cross the three timed laser beams when they are inactive.
- Collect the access card and reach the EXIT door.
- If a guard spots the player or an active laser is touched, the player returns to the checkpoint.
- The game can be restarted from the win screen.

## Project structure

```text
prison_escape_phaser/
├── index.html
├── style.css
├── README.md
├── assets/
│   ├── prisoner_character.png
│   ├── prisoner_walk.png
│   └── prison_background.png
└── src/
    ├── main.js
    └── scenes/
        ├── BootScene.js
        ├── MenuScene.js
        ├── GameScene.js
        ├── WinScene.js
        └── LoseScene.js
```

## Course concepts demonstrated

- **Scenes:** Boot, Menu, Game, Win and Lose scenes.
- **Background images:** a prison interior background image is loaded and used in the level; the original character artwork is also included.
- **Object manipulation:** player movement, collectible key/card, guard patrol and exit state.
- **Spritesheets:** a four-frame player walk spritesheet with a Phaser animation.
- **Physics:** Arcade Physics, world bounds, static walls, overlaps and collision responses.
- **Input:** keyboard controls using arrows and WASD; pointer input for menu/restart buttons.
- **Cameras:** camera bounds and smooth follow of the player.
- **Tile sprites:** repeating floor texture used as the level background.
- **Audio output:** short synthesized sound effects using the browser Web Audio API after the first user interaction.

## Notes

Phaser is loaded from jsDelivr in `index.html`, so an internet connection is required when opening the game for the first time. The `LoseScene` is included as a separate scene for the project structure and can be connected to additional fail conditions if desired.
