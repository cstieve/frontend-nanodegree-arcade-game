// Create constants that will give more meaning to the numbers we are using
var COLUMN_WIDTH = 101;
var ROW_HEIGHT = 83;

// canvas boundaries
var CANVAS_WIDTH = 505;
var CANVAS_HEIGHT = 606;

// vertical offset to better position the enemy/barrier within a cell
var VERTICAL_ENEMY_OFFSET = 25;


// Enemies our player must avoid
var Enemy = function(row) {

  // The image/sprite for our enemies, this uses
  // a helper we've provided to easily load images
  this.sprite = 'images/enemy-bug.png';

  // set the enemy row, or 0 if not passed
  this.row = row || 0;

  // call reset which essentially sets up the positioning and speed
  this.reset();
};


// Reset an Enemy
Enemy.prototype.reset = function() {

  // negative value of sprite/column width + random number between 1 and 500 to
  // stagger the entrance of the enemies
  this.x = 0 - (COLUMN_WIDTH + Math.floor((Math.random() * 500) + 1));

  // we do (row - 1) since the top of the enemy would essentially touch the
  // bottom of the row above. then we offset the enemy to visibly center him
  // in his cell
  this.y = ((this.row - 1) * ROW_HEIGHT) - VERTICAL_ENEMY_OFFSET;

  // set random speeds for the enemies
  this.speedParam = Math.floor((Math.random() * 100)+50);
};


// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
  var sprite = Resources.get(this.sprite),
  spriteWidth = sprite.width,
  canvasWidth = ctx.canvas.width;

  // create movement multiplying by time delta to maintain consistent speed
  // accross browsers
  this.x = Math.round(this.x + (this.speedParam * dt));

  // if the enemy has gone beyond the canvas, lets start him at the beginning
  if (this.x > canvasWidth) {
    this.x = 0 - spriteWidth;
  }
};


// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


// Our single player
var Player = function() {
  this.sprite = 'images/char-horn-girl.png';
  this.reset();
};


// Reset a player
Player.prototype.reset = function() {
  // set row and column
  this.row = 6;
  this.column = 3;

  // (x would be at the end of the second cell since it is the left-most point
  // on the image)
  this.x = (this.column - 1) * COLUMN_WIDTH;


  // start at the bottom of the 5th row and subtract 9 for nicer positioning
  // within the cell
  this.y = ((this.row - 1) * ROW_HEIGHT) - 9;

};


// draw the player image on the canvas
Player.prototype.update = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


// render the player
Player.prototype.render = function() {
  this.update();
};


// convert the user input into actual player movement
Player.prototype.handleInput = function(selectedKey) {
  var previousX = this.x,
  previousY = this.y,
  previousColumn = this.column,
  previousRow = this.row,
  barrierIsInTheWay = false,
  _this = this;

  switch (selectedKey) {
    case 'left':{
      // will moving left take us beyond the left horizontal bounds?
      if((this.x - COLUMN_WIDTH) >= 0) {
        // if we are move left one cell
        this.x = this.x - COLUMN_WIDTH;
        this.column--;
      }
      break;
    }
    case 'right': {
      // will moving right take us beyond the right horizontal bounds?
      if((this.x + COLUMN_WIDTH) < CANVAS_WIDTH){
        // if we are move right one cell
        this.x = this.x + COLUMN_WIDTH;
        this.column++;
      }
      break;
    }
    case 'up': {
      // will moving up take us beyond the upper vertical bounds?
      if((this.y - (ROW_HEIGHT/2)) >= 0){
        // if we are move up one cell
        this.y = this.y - ROW_HEIGHT;
        this.row--;
      }
      break;
    }
    case 'down': {
      // will moving down take us beyond the lower vertical bounds?
      if((this.y+171 + ROW_HEIGHT) <= CANVAS_HEIGHT){
        // if we are move down one cell
        this.y = this.y + ROW_HEIGHT;
        this.row++;
      }
      break;
    }
    default: {
      break;
    }
  }

  // check all the barriers to make sure none are in the way
  allBarriers.forEach(function(barrier) {
    if(barrier.occupiesSpace(_this.column, _this.row)){
      barrierIsInTheWay = true;
      return;
    }
  });

  // if barriers are in the way, revert our positions
  if(barrierIsInTheWay){
    this.x = previousX;
    this.y = previousY;
    this.column = previousColumn;
    this.row = previousRow;
  }

  // lets update our position
  this.update();
};


// Barriers our player can not step on
var Barrier = function() {

  // The image/sprite for our enemies, this uses
  // a helper we've provided to easily load images
  this.sprite = 'images/Rock.png';

  // randomly pick a row
  this.row = Math.floor((Math.random() * 6)+1);

  // randomly pick a column
  this.column = Math.floor((Math.random() * 5)+1);

  // we do (column - 1) because the x position is the leftmost
  // position on the sprite so if it is in column 5 its x would
  // be at 4 columns times width
  this.x = (this.column-1) * COLUMN_WIDTH;

  // we do (row - 1) since the top of the enemy would essentially
  // touch the bottom of the row above. Then we offset the enemy to
  // visibly center him in his cell
  this.y = ((this.row - 1) * ROW_HEIGHT) - VERTICAL_ENEMY_OFFSET;
};


// render the Barrier
Barrier.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


// check if the barrier occupies the column and row that are passed in
// to the function
Barrier.prototype.occupiesSpace = function(column, row) {
  if((column === this.column) && (row === this.row)){
    return true;
  } else {
    return false;
  }
};


// instantiate all the barriers
var allBarriers = [
  new Barrier(),
  new Barrier(),
  new Barrier()
];


// place all enemy objects in an array called allEnemies passing in
// the row they should reside in
var allEnemies = [
  new Enemy(4),
  new Enemy(3),
  new Enemy(3),
  new Enemy(2),
  new Enemy(2),
  new Enemy(2)
];


// instantiate the player
var player = new Player();


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
