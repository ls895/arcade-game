/**
 * Enemy constructor
 * @constructor
 * @param  {float} x horizontal coordinate
 * @param  {integer} yi row number
 * @param  {integer} dxdt movement speed as pixel per second
 * @return {object} Enemy A Enemy object
 */
var Enemy = function(x, yi, dxdt) {
    /**
     * Horizontal coordinate of the Enemy object
     * @type {float}
     */
    this.x = x;
    /**
     * Row number of the Enemy object
     * @type {integer}
     */
    this.yi = yi;
    /**
     * Vertical coordinate of the Enemy object
     * @type {integer}
     */
    this.y = 83 * this.yi - 25;
    /**
     * Tail of the Enemy object
     * @type {float}
     */
    this.left = this.x + 2;
    /**
     * Head of the Enemy object
     * @type {float}
     */
    this.right = this.x + 98;
    /**
     * Speed of the Enemy object
     * @type {float}
     */
    this.dxdt = dxdt;
    /**
     * Image asset of the Enemy object
     * @type {String}
     */
    this.sprite = 'images/enemy-bug.png';
};

/**
 * Horizontal coordinate limit for Enemy objects
 * @constant
 * @type {integer}
 */
Enemy.maxBound = 505;

/**
 * Distribution of Enemy objects movement speed (pixel per second)
 * @constant
 * @type {integer}
 */
Enemy.spread = 100;

/**
 * Get user settings for Enemy numbers and difficulty (i.e. movement speed)
 * @return {boolean} True or false depending on user selection
 */
Enemy.getSetting = function() {
    var e = document.getElementById('number');
    /**
     * Enemy numbers
     * @constant
     * @type {integer}
     */
    Enemy.maxNo = parseInt(e.options[e.selectedIndex].value);
    e = document.getElementById('difficulty');
    /**
     * Enemy base movement speed as pixel per second
     * @constant
     * @type {integer}
     */
    Enemy.baseSpeed = parseInt(e.options[e.selectedIndex].value);
    if (!Enemy.maxNo || !Enemy.baseSpeed) {
        return false;
    } else {
        return true;
    }
};

/**
 * Generate a random row number for Enemy objects
 * @return {integer} a random row number
 */
Enemy.ranRow = function() {
    return (Math.floor(Math.random() * 3) + 1);
};

/**
 * Generate a random movement for Enemy objects
 * @return {float} a random speed
 */
Enemy.ranSpd = function() {
    return (Math.random() * Enemy.spread + Enemy.baseSpeed);
};

/**
 * Update Enemy objects every frame
 * @param  {float} dt time delta between 2 successive frames
 * @return {null}
 */
Enemy.prototype.update = function(dt) {
    this.x += this.dxdt * dt;
    this.left = this.x + 2;
    this.right = this.x + 98;
    if (this.x > Enemy.maxBound) {
        this.reset();
    }
    this.checkCollision();
};

/**
 * Collision detection between Enemy objects and Player object
 * @return {null}
 */
Enemy.prototype.checkCollision = function() {
    if (
        (
            (
                this.right > player.right &&
                player.right > this.left
            ) ||
            (
                this.right > player.left &&
                player.left > this.left
            )
        ) &&
        (this.yi === player.yi)
    ) {
        player.kill(2, 5);
    }
};

/**
 * Reset Enemy object position after Enemy object goes out of bound
 * @return {null}
 */
Enemy.prototype.reset = function() {
    this.yi = Enemy.ranRow();
    this.x = -50.5;
    this.y = 83 * this.yi - 25;
    this.left = this.x + 2;
    this.right = this.x + 98;
    this.dxdt = Enemy.ranSpd();
};

/**
 * Draw Enemy object on the canvas
 * @return {null}
 */
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

/**
 * Player constructor
 * @constructor
 * @param  {integer} xi column number
 * @param  {integer} yi row number
 * @return {object} Player A Player object
 */
var Player = function(xi, yi) {
    /**
     * Column number of the Player object
     * @type {integer}
     */
    this.xi = xi;
    /**
     * Row number of the Player object
     * @type {integer}
     */
    this.yi = yi;
    this.toPixel();
    /**
     * Number of bullets the Player object has
     * @type {integer}
     */
    this.bullet = 5;
    /**
     * Number of life the Player object has
     * @type {integer}
     */
    this.life = 3;
    /**
     * Image asset of the Player object
     * @type {string}
     */
    this.sprite = 'images/char-boy.png';
    /**
     * Image asset of hearts
     * @type {string}
     */
    this.heart = 'images/Heart.png';
};

/**
 * Compute horizontal and vertical coordinates for the Player object
 * @return {null}
 */
Player.prototype.toPixel = function() {
    /**
     * Horizontal coordinate of the Player object
     * @type {float}
     */
    this.x = 101 * this.xi;
    /**
     * Vertical coordinate of the PLayer object
     * @type {float}
     */
    this.y = 83 * this.yi - 30;
    /**
     * Left hand side coordinate of the Player object
     * @type {float}
     */
    this.left = this.x + 17;
    /**
     * Right hand side coordinate of the Player object
     * @type {float}
     */
    this.right = this.x + 84;
};

/**
 * Update the Player object every frame
 * @param  {float} dt time delta between successive frames
 * @return {boolean} True or false depending on whether the Player is dead
 */
Player.prototype.update = function(dt) {
    if (this.life === 0) {
        return true;
    }
    if (this.reloading) {
        this.reloadGun(dt);
    }
    return false;
};

/**
 * Fire a bullet from the Player object
 * @return {null}
 */
Player.prototype.fire = function() {
    if (this.bullet >= 1 && !this.reloading) {
        bullets.push(new Bullet(this.left, this.yi));
        this.bullet -= 1;
        if (this.bullet === 0) {
            /**
             * Indicates whether the Player is reloading
             * @type {boolean}
             */
            this.reloading = true;
            /**
             * Indicates the reloading status or progress of the Player
             * @type {float}
             */
            this.status = 0;
        }
    }
};

/**
 * Reload the bullet inventory for the Player object
 * @param  {float} dt time delta between successive frames
 * @return {null}
 */
Player.prototype.reloadGun = function(dt) {
    if (this.status + 20 * dt < 100) {
        this.status += 20 * dt;
        this.bullet = Math.floor(this.status / 20);
    } else {
        this.status = 100;
        this.bullet = 5;
        this.reloading = false;
    }
};

/**
 * Kill the Player and reset the Player's position and inventory
 * @param  {integer} xi column number
 * @param  {integer} yi row number
 * @return {null}
 */
Player.prototype.kill = function(xi, yi) {
    this.life -= 1;
    this.xi = xi;
    this.yi = yi;
    this.toPixel();
    this.bullet = 5;
    this.reloading = false;
};

/**
 * Reset the Player totally including number of life
 * @param  {integer} xi column number
 * @param  {integer} yi row number
 * @return {null}
 */
Player.prototype.reset = function(xi, yi) {
    this.kill(xi, yi);
    this.life = 3;
};

/**
 * Draw the Player object, the Player hearts, the bullet inventory and reloading status
 * @return {null}
 */
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    for (var i = 0; i < this.life; i++) {
        ctx.drawImage(Resources.get(this.heart), 70 * i + 10, 525, 50, 70);
    }
    if (!this.reloading) {
        ctx.font = '30px Arial';
        ctx.fillText(this.bullet.toString(), 400, 570);
    } else {
        ctx.font = '23px Arial';
        ctx.strokeRect(370, 550, 100, 30);
        ctx.fillRect(370, 550, this.status, 30);
        ctx.fillText('reloading', 370, 572);
    }
};

/**
 * Handle input from keyboard and select Player object responses
 * @param  {string} key Keypress
 * @return {null}
 */
Player.prototype.handleInput = function(key) {
    switch (true) {
        case (key === 'left' && this.xi - 1 >= 0):
            this.xi -= 1;
            this.toPixel();
            return;
        case (key === 'right' && this.xi + 1 <= 4):
            this.xi += 1;
            this.toPixel();
            return;
        case (key === 'down' && this.yi + 1 <= 5):
            this.yi += 1;
            this.toPixel();
            return;
        case (key === 'up' && this.yi - 1 >= 0):
            this.yi -= 1;
            if (this.yi === 0) {
                this.reset(2, 5);
                return;
            } else {
                this.toPixel();
                return;
            }
        case (key === 'space'):
            this.fire();
            break;
        case (key === 'r'):
            if (this.bullet < 5 && !this.reloading) {
                this.reloading = true;
                this.status = this.bullet * 20;
            }
    }
};

/**
 * Bullet constructor
 * @constructor
 * @param  {float} x  Horizontal coordinate
 * @param  {integer} yi row number
 * @return {object} Bullet A Bullet object
 */
var Bullet = function(x, yi) {
    /**
     * Horizontal coordinate of the Bullet object
     * @type {float}
     */
    this.x = x - 40;
    /**
     * Row number of the Bullet object
     * @type {integer}
     */
    this.yi = yi;
    /**
     * Vertical coordinate of the Bullet object
     * @type {float}
     */
    this.y = 83 * this.yi + 50;
    /**
     * Movement speed of the Bullet object
     * @type {integer}
     */
    this.dxdt = Bullet.speed;
    /**
     * Image asset of the Bullet object
     * @type {string}
     */
    this.sprite = 'images/Bullet.png';
};

/**
 * Bullet movement speed as pixel per second
 * @constant
 * @type {integer}
 */
Bullet.speed = 300;

/**
 * Update the Bullet object every frame
 * @param  {float} dt time delta between successive frames
 * @return {null}
 */
Bullet.prototype.update = function(dt) {
    this.x -= this.dxdt * dt;
    if (this.x + 70 <= 0) {
        var index = bullets.indexOf(this);
        bullets.splice(index, 1);
    } else {
        this.checkHit();
    }
};

/**
 * Collision detection between Bullet objects and Enemy objects
 * @return {null}
 */
Bullet.prototype.checkHit = function() {
    var bug;
    for (var i = 0; i < allEnemies.length; i++) {
        bug = allEnemies[i];
        if (bug.yi === this.yi) {
            if (this.x <= bug.right && bug.right <= this.x + 10) {
                bug.reset();
                var index = bullets.indexOf(this);
                bullets.splice(index, 1);
            }
        }
    }
};

/**
 * Draw Bullets object on the canvas
 * @return {null}
 */
Bullet.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

/**
 * Array storing Bullet objects instantiation
 * @type {Array}
 */
var bullets = [];

/**
 * Array storing Enemy objects instantiation
 * @type {Array}
 */
var allEnemies = [];

/**
 * Player object instantiation
 * @param {integer} 2 column number of the Player object
 * @param {integer} 5 row number of the Player object
 */
var player = new Player(2, 5);

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        32: 'space',
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        82: 'r'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
