/**
 * Enemy constructor
 * @param  {integer} x    x-axis location
 * @param  {integer} y    y-axis location
 * @param  {integer} dxdt movement speed
 * @return {object} Enemy a new <pre><code>Enemy</code></pre> object
 */
var Enemy = function(x, yi, dxdt) {
    this.x = x;
    this.yi = yi;
    this.y = 83 * this.yi - 25;
    this.dxdt = dxdt;
    this.sprite = 'images/enemy-bug.png';
};

Enemy.maxBound = 505;

Enemy.maxNo = 7;

Enemy.ranRow = function() {
    return (Math.floor(Math.random() * 3) + 1);
};

Enemy.ranSpd = function() {
    return (Math.random() * 100 + 200);
};

/**
 * Enemy update position
 * @param  {integer} dt time delta between ticks
 * @return {undefined}
 */
Enemy.prototype.update = function(dt) {
    this.x += this.dxdt * dt;
    if (this.x > Enemy.maxBound) {
        this.reset();
    }
    this.checkCollision();
};

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
        player.reset(2, 5);
    }
};

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
};

Player.prototype.toPixel = function() {
    this.x = 101 * this.xi;
    this.y = 83 * this.yi - 30;
};

Player.prototype.update = function() {
//Do some shit to update the player at every frame
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
var player = new Player(2, 5);

var allEnemies = [];
for (var i = 0; i < Enemy.maxNo; i++) {
    allEnemies.push(new Enemy(-50.5, Enemy.ranRow(), Enemy.ranSpd()));
}

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
