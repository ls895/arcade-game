/**
 * Enemy constructor
 * @param  {float} x      horizontal coordinate
 * @param  {integer} yi   row number
 * @param  {integer} dxdt speed as pixel per second
 * @return {object} Enemy Enemy object
 */
var Enemy = function(x, yi, dxdt) {
    this.x = x;
    this.yi = yi;
    this.y = 83 * this.yi - 25;
    this.dxdt = dxdt;
    this.sprite = 'images/enemy-bug.png';
};

/**
 * Horizontal position limit for Enemy
 * @type {Number}
 */
Enemy.maxBound = 505;

Enemy.spread = 100;

Enemy.getSetting = function() {
    var e = document.getElementById('number');
    Enemy.maxNo = parseInt(e.options[e.selectedIndex].value);
    e = document.getElementById('difficulty');
    Enemy.baseSpeed = parseInt(e.options[e.selectedIndex].value);
};

/**
 * Generate a random row number
 * @return {integer} a random row number
 */
Enemy.ranRow = function() {
    return (Math.floor(Math.random() * 3) + 1);
};

/**
 * Generate a random speed mean 250 pixel per second
 * @return {float} a random speed
 */
Enemy.ranSpd = function() {
    return (Math.random() * Enemy.spread + Enemy.baseSpeed);
};

/**
 * Update enemy object per tick
 * @param  {float} dt time delta between ticks
 * @return {null}
 */
Enemy.prototype.update = function(dt) {
    this.x += this.dxdt * dt;
    if (this.x > Enemy.maxBound) {
        this.reset();
    }
    this.checkCollision();
};

/**
 * Check enemy and player object collision
 * @return {null}
 */
Enemy.prototype.checkCollision = function() {
    this.left = this.x + 2;
    this.right = this.x + 98;
    player.left = player.x + 17;
    player.right = player.x + 84;
    if (
        (
            (
                this.right > player.right
                &&
                player.right > this.left
            )
            ||
            (
                this.right > player.left
                &&
                player.left > this.left
            )
        )
        &&
        (this.yi === player.yi)
    ) {
        player.life -= 1;
        player.reset(2, 5);
    }
};

/**
 * Reset enemy object position to left of screen and assign a random row and spd
 * @return {null}
 */
Enemy.prototype.reset = function() {
    this.yi = Enemy.ranRow();
    this.x = -50.5;
    this.y = 83 * this.yi - 25;
    this.dxdt = Enemy.ranSpd();
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

/**
 * Player constructor
 * @param  {integer} x horizontal location
 * @param  {integer} y vertical location
 * @return {object} Player a new <pre><code>Player</code></pre> object
 */
var Player = function(xi, yi) {
    this.xi = xi;
    this.yi = yi;
    this.toPixel();
    this.sprite = 'images/char-boy.png';
    this.energy = 100;
    this.life = 3;
};

Player.prototype.attack = function() {
    if (this.energy >= 20) {
        var bug;
        this.energy -= 20;
        for (var i = 0; i < allEnemies.length; i++) {
            bug = allEnemies[i];
            if (
                (
                    bug.right > this.left - 50
                    &&
                    bug.right < this.left
                )
                &&
                (bug.yi === this.yi)
            ) {
                bug.reset();
            }
        }
    }
};

Player.prototype.toPixel = function() {
    this.x = 101 * this.xi;
    this.y = 83 * this.yi - 30;
};

Player.prototype.update = function(dt) {
    if (this.life === 0) {
        console.log('game over');
    }
    if (this.energy < 100) {
        if (this.energy + 10 * dt < 100) {
            this.energy += 10 * dt;
        } else {
            this.energy = 100;
        }
    }
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function(key) {
    switch (true) {
    case (key === 'left' && this.xi - 1 >= 0) :
        this.xi -= 1;
        this.toPixel();
        return;
    case (key === 'right' && this.xi + 1 <= 4) :
        this.xi += 1;
        this.toPixel();
        return;
    case (key === 'down' && this.yi + 1 <= 5) :
        this.yi += 1;
        this.toPixel();
        return;
    case (key === 'up' && this.yi - 1 >= 0) :
        this.yi -= 1;
        if (this.yi === 0) {
            this.reset(2, 5);
            return;
        } else {
            this.toPixel();
            return;
        }
    case (key === 'space'):
        this.attack();
    }
};

Player.prototype.reset = function(xi, yi) {
    this.xi = xi;
    this.yi = yi;
    this.toPixel();
};
// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var allEnemies = [];
var player = new Player(2, 5);

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        32: 'space',
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
