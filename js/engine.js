/**
 * Indicates whether game has been won, lost or continuing
 * 0 = Game lost
 * 1 = Game won
 * 2 = Continuing as default
 * @type {integer}
 */
var gameStatus = 2;

var Engine = (function(global) {
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime,
        // animationID to store the ID of queued animation frame
        animationID;

    canvas.width = 505;
    canvas.height = 606;
    doc.body.appendChild(canvas);

    /* This main() function serves as the kickoff point for the game loop itself
     * and handles game lost, game won and game continuing behaviors
     */
    function main() {
        /* gameStatus will be 1 through player handle input function, which is
         * queued between successive main() executions. Therefore check
         * gameStatus === 1 at beginning of every main() execution and return
         * from main() thus stopping the animation if player has already won.
         */
        if (gameStatus === 1) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.font = '30px Arial';
            ctx.fillStyle = 'black';
            ctx.fillText('You Won', 10, 100);
            ctx.fillText('Press start to reset the game', 10, 150);
            return;
        }

        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;

        update(dt);

        /* After the update function, gameStatus will be 0 if player is dead
         * through enemy collision. Therefore only check gameStatus === 0
         * after update() execution. If player is dead, main() is returned and
         * animation is stopped
         */
        if (gameStatus === 0) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.font = '30px Arial';
            ctx.fillStyle = 'black';
            ctx.fillText('You Lost', 10, 100);
            ctx.fillText('Press start to reset the game', 10, 150);
            return;
        }

        /* If the code reaches here, gameStatus must be 2 and thus rendering and
         * game looping will be continued
         */
        render();

        lastTime = now;

        animationID = win.requestAnimationFrame(main);
    }

    /* init() is only called once when the page first loads the display basic
     * instructions for user to know how to play the game
     */
    function init() {
        ctx.font = '30px Arial';
        ctx.fillStyle = 'black';
        ctx.fillText('1. Select No. of enemies', 10, 100);
        ctx.fillText('2. Select Difficulty', 10, 150);
        ctx.fillText('3. Press Start to play or reset game', 10, 200);
        ctx.fillText('4. Press Arrow keys to move', 10, 250);
        ctx.fillText('5. Press Space to fire', 10, 300);
        ctx.fillText('6. Press R to reload', 10, 350);
        ctx.fillText('7. Cross 3 times to win the game', 10, 400);
        ctx.fillText('8. Do not get killed 3 times in a row', 10, 450);
    }

    function update(dt) {
        updateEntities(dt);
    }

    function updateEntities(dt) {
        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });

        /* After updating the enemies, gameStatus could be set to 0 if player
         * is dead, so only update the player and bullet objects if player is
         * still alive
         */
        if (gameStatus === 2) {
            player.update(dt);

            /* Run the bullet update method if there are bullet objects in
             * the bullets array.
             */
            if (bullets.length > 0) {
                bullets.forEach(function(bullet) {
                    bullet.update(dt);
                });
            }
        }
    }

    function render() {
        var rowImages = [
                'images/water-block.png',
                'images/stone-block.png',
                'images/stone-block.png',
                'images/stone-block.png',
                'images/grass-block.png',
                'images/grass-block.png'
            ],
            numRows = 6,
            numCols = 5,
            row, col;

        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
            }
        }

        renderEntities();
    }

    function renderEntities() {
        allEnemies.forEach(function(enemy) {
            enemy.render();
        });

        player.render();

        /* Run the bullet render method if there are bullet objects in
         * the bullets array.
         */
        if (bullets.length > 0) {
            bullets.forEach(function(bullet) {
                bullet.render();
            });
        }
    }

    /* reset() is called everytime the Start button is pressed, resetting the
     * entire game state and start or restart the animation
     */
    function reset() {
        // Clear Start button focus
        this.blur();

        // Reset game status
        gameStatus = 2;

        // Check user selection on options
        if (Enemy.getSetting()) {
            // Set fillstyle for words/ shapes on the canvas to be in gold color
            ctx.fillStyle = 'gold';

            // Clear allEnemies array and refill it on every reset
            allEnemies.length = 0;
            for (var i = 0; i < Enemy.MAX_NO; i++) {
                allEnemies.push(new Enemy(Enemy.ranRow(), Enemy.ranSpd()));
            }

            // Clear bullets array on every reset
            bullets.length = 0;

            // Detect queued animation frame, if any cancel the animation frame
            if (animationID) {
                win.cancelAnimationFrame(animationID);

                // Only reset the player if the game has been run at least once
                player.reset(2, 5);
            }

            // Prepare lastTime for main() to use once main() is called
            lastTime = Date.now();

            // Store the ID of queued animation frame and start the animation
            animationID = win.requestAnimationFrame(main);
        } else {
            // Display instructions for user to select options if not selected
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillText('Please select the options', 10, 100);
            ctx.fillText('Then press Start', 10, 150);
        }
    }

    // Event listener for the Start button and calls reset()
    document.getElementById('start').addEventListener('click', reset);

    Resources.load([
        'images/splash.png',
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/char-boy.png',
        'images/Heart.png',
        'images/Bullet.png'
    ]);
    Resources.onReady(init);

    global.ctx = ctx;
})(this);
