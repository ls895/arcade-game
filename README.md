# Frogger Clone

## Introduction
This is a OO Javascript based 2D game as project 3 in Udacity's Frontend Nanodegree.

## Running the Game
Launch /index.html in a web browser and the game welcome screen will be displayed.
* Associated files must be present in the root directory:
    * /js folder:
        * app.js
        * engine.js
        * resources.js
    * /images folder:
        * splash.png
        * stone-block.png
        * water-block.png
        * grass-block.png
        * enemy-bug.png
        * char-boy.png
        * Heart.png
        * Bullet.png
    * /css folder:
        * style.css

## Game Objective
* Control the player to cross all 3 lanes occupied by enemy bugs to reach the river.
* Eliminate enemy bugs by firing the player's weapon.
* Achieve and/ or avoid the conditions in the section below to win the game.

## Conditions
* Winning
    * Player must accumulate 3 crossings in a game to win.
* Losing
    * Player killed 3 times in a **single crossing** before making 3 accumulated crossings.
* Player getting killed
    * Player getting hit by an enemy bug, meaning:
        * The enemy bug's head touching the player's left hand side, or
        * The enemy bug and the player are in any overlapping position on the screen.
* Player resetting
    * When the player gets killed, the player is reset to the starting position, only if the player has not run out of amount of life (3), otherwise the game is considered lost.
        * If the player gets reset: the following are also reset:
            * Number of life back to 3,
            * Number of bullets back to 5.
* Enemy bug resetting
    * An enemy bug gets reset to the left of screen if:
        * The enemy bug goes out of bounds to the right of screen without hitting the player, or
        * The enemy bug gets hit by a bullet fired by the player.
* Enemy bug getting hit by bullet
    * An enemy bug gets hit by a bullet if the left of the bullet touches the enemy bug's head or beyond.

## Instructions
### Starting the game
On the welcome screen select options then press the "Start" button, if options are not selected, a reminder will be given on the screen. Available options are:
* Number of enemy bugs to spawn
* Difficulty level (as the average movement speed of enemy bugs)

### Game Controls
* **Arrow** keys **up**, **down**, **left**, **right** controls the player position.
    * Player position will not go out of bounds of the game level.
* **Space bar** fires a bullet from the player.
    * Player has 5 bullets initially. If the bullet inventory reaches 0, automatic reloading occurs in which the player cannot fire anymore bullets until the reloading completes.
* **R** reloads the player bullet inventory as user's discretion.
    * Again, firing is not allowed before reloading completes.

### Indications
* Number of life
    * Displayed as red hearts at lower left of the screen. 3 at the maximum and diminishes if the player gets hit by enemy bugs.
* Bullet inventory
    * Displayed as number at lower right of the screen, or
    * Displayed as a progress bar during reloading.
    * Maximum number of bullets in the inventory is 5. Reloading speed is 1 bullet per second.

### Object Spawning
* Enemy bugs are spawned when the game is started/ restarted i.e. the "Start" button is pressed. Afterwards they only get reset to the left of screen (the starting position) when they go out of bounds or get hit by a bullet.
* Random Distribution:
    * Every bug when spawned, or reset, receive a random lane out of the 3 lanes to occupy, and a random speed to move at.

### Restarting the Game
At any time during the game, press the "Start" button with different options (optional) to completely reset and restart the game.

## Game Results
A respective screen is given to indicate the result when either the Winning or Losing condition is reached. Pressing the "Start" button with different options (optional) resets and restarts the game.
