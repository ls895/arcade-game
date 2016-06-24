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
    this.left = this.x + 2;
    this.right = this.x + 98;
    this.dxdt = dxdt;
    this.sprite = 'images/enemy-bug.png';
};

/**
 * Horizontal position limit for Enemy
 * @type {Number}
 */
Enemy.maxBound = 505;

/**
 * [spread description]
 * @type {Number}
 */
Enemy.spread = 100;


Enemy.getSetting = function() {
    var e = document.getElementById('number');
    Enemy.maxNo = parseInt(e.options[e.selectedIndex].value);
    e = document.getElementById('difficulty');
    Enemy.baseSpeed = parseInt(e.options[e.selectedIndex].value);
    if (!Enemy.maxNo || !Enemy.baseSpeed) {
        return false;
    } else {
        return true;
    }
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
    this.left = this.x + 2;
    this.right = this.x + 98;
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
 * Reset enemy object position to left of screen and assign a random row and spd
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
 * Draw enemy bugs on the screen
 * @return {[type]} [description]
 */
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
    this.heart = 'images/Heart.png';
    this.bullet = 5;
    this.life = 3;
};

Player.prototype.toPixel = function() {
    this.x = 101 * this.xi;
    this.y = 83 * this.yi - 30;
    this.left = this.x + 17;
    this.right = this.x + 84;
};

Player.prototype.update = function(dt) {
    if (this.life === 0) {
        return true;
    }
    if (this.reloading) {
        this.reloadGun(dt);
    }
    return false;
};

Player.prototype.fire = function() {
    if (this.bullet >= 1 && !this.reloading) {
        bullets.push(new Bullet(this.left, this.yi));
        this.bullet -= 1;
        if (this.bullet === 0) {
            this.reloading = true;
            this.status = 0;
        }
    }
};

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

Player.prototype.kill = function(xi, yi) {
    this.life -=1;
    this.xi = xi;
    this.yi = yi;
    this.toPixel();
    this.bullet = 5;
    this.reloading = false;
};

Player.prototype.reset = function(xi, yi) {
    this.kill(xi, yi);
    this.life = 3;
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    for (var i = 0; i < this.life; i++) {
        ctx.drawImage(Resources.get(this.heart), 10 + 70 * i, 525, 50, 70);
    }
    if (!this.reloading) {
        ctx.font = '30px Arial';
        ctx.fillText(this.bullet.toString(), 400, 570);
    } else {
        ctx.font = '25px Arial';
        ctx.strokeRect(370, 550, 100, 30);
        ctx.fillRect(370, 550, this.status, 30);
        ctx.fillText('reloading', 370, 570);
    }
};

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

var Bullet = function(x, yi) {
    this.x = x - 40;
    this.yi = yi;
    this.y = 83 * this.yi + 50;
    this.dxdt = Bullet.speed;
    this.sprite = 'images/Bullet.png';
};

Bullet.speed = 300;

Bullet.prototype.update = function(dt) {
    this.x -= this.dxdt * dt;
    if (this.x + 70 <= 0) {
        var index = bullets.indexOf(this);
        bullets.splice(index, 1);
    } else {
        this.checkHit();
    }
};

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

Bullet.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var bullets = [];
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
        40: 'down',
        82: 'r'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
