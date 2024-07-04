// Define the game canvas
var canvas = document.getElementById('game');
var context = canvas.getContext('2d');

// Define the size of the game grid
var grid = 16;
var count = 0;

var score = 0;

// Create the snake in the game
var snake = {
  x: 160,
  y: 160,
  
  // Snake speed in x-y direction
  dx: grid,
  dy: 0,
  
  // Keep track of the cells have been visited by the snake
  cells: [],
  
  // Length of the snake. It grows when it eats an apple
  maxCells: 4
};

// Create the apple in the game
var apple = {
  x: 320,
  y: 320
};

var obstacles = [{ x: 0, y: 0 }, { x: 0, y: 0 }];

function generateObstaclePosition() {
  return Math.floor(Math.random() * 25) * grid;
}

function resetGame() {

    snake.x = 160;
    snake.y = 160;
    snake.cells = [];
    snake.maxCells = 4;
    snake.dx = grid;
    snake.dy = 0;
    
    // Canvas is 400x400 which is 25x25 cells 
    apple.x = getRandomInt(0, 25) * grid;
    apple.y = getRandomInt(0, 25) * grid;

    obstacles.forEach(function(obstacle) {
        obstacle.x = generateObstaclePosition();
        obstacle.y = generateObstaclePosition();
      });
}

// Generate initial positions for the obstacles
obstacles.forEach(function(obstacle) {
  obstacle.x = generateObstaclePosition();
  obstacle.y = generateObstaclePosition();
});
  

// Function to get random positions for apple's x and y coordinates
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// Game loop
function loop() {
  requestAnimationFrame(loop);
  
  // Slow game loop to 15 fps instead of 60 (60/15 = 4)
  if (++count < 4) {
    return;
  }
  
  count = 0;
  context.clearRect(0,0,canvas.width,canvas.height);

  // Move snake by it's velocity
  snake.x += snake.dx;
  snake.y += snake.dy;

  // Wrap snake position horizontally on edge of screen
  if (snake.x < 0) {
    snake.x = canvas.width - grid;
  }
  else if (snake.x >= canvas.width) {
    snake.x = 0;
  }
  
  // Wrap snake position vertically on edge of screen
  if (snake.y < 0) {
    snake.y = canvas.height - grid;
  }
  else if (snake.y >= canvas.height) {
    snake.y = 0;
  }

  // Keep track of where snake has been. Front of the array is always the head of the snake.
  snake.cells.unshift({x: snake.x, y: snake.y});

  // Remove cells as we move away from them
  if (snake.cells.length > snake.maxCells) {
    snake.cells.pop();
  }

  // Draw apple
  context.fillStyle = 'red';
  context.fillRect(apple.x, apple.y, grid-1, grid-1);


  // Draw obstacles
  context.fillStyle = 'blue';
  obstacles.forEach(function(obstacle) {
    context.fillRect(obstacle.x, obstacle.y, grid-1, grid-1);
  });

  // Draw snake
  context.fillStyle = 'green';
  snake.cells.forEach(function(cell, index) {
    
    // Drawing 1 px smaller than the grid creates a grid effect in the snake body so you can see how long it is
    context.fillRect(cell.x, cell.y, grid-1, grid-1);  
    
    // Snake ate apple
    if (cell.x === apple.x && cell.y === apple.y) {
      snake.maxCells++;
      score++;
      document.getElementById("score").innerText = 'Score: '+score;
      
      // Canvas is 400x400 which is 25x25 cells 
      apple.x = getRandomInt(0, 25) * grid;
      apple.y = getRandomInt(0, 25) * grid;
    }
    
    // Check collision with all cells after this one (modified bubble sort)
    for (var i = index + 1; i < snake.cells.length; i++) {
      
      // Collision. Reset game
      if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
        resetGame();
      }
    }

  // Check collision with all obstacles
  for (var i = 0; i < obstacles.length; i++) {
    if (snake.x === obstacles[i].x && snake.y === obstacles[i].y) {
      // Collision with obstacle. Reset game.
      resetGame();
    }
  }


  });
}

// Listen to arrow keys to move the snake
document.addEventListener('keydown', function(e) {
  
  // Prevent snake from backtracking on itself by checking that it's 
  // not already moving on the same axis (pressing left while moving
  // left won't do anything, and pressing right while moving left
  // shouldn't let you collide with your own body)
  
  // Left arrow key
  if (e.which === 37 && snake.dx === 0) {
    snake.dx = -grid;
    snake.dy = 0;
  }
  // Up arrow key
  else if (e.which === 38 && snake.dy === 0) {
    snake.dy = -grid;
    snake.dx = 0;
  }
  // Right arrow key
  else if (e.which === 39 && snake.dx === 0) {
    snake.dx = grid;
    snake.dy = 0;
  }
  // Down arrow key
  else if (e.which === 40 && snake.dy === 0) {
    snake.dy = grid;
    snake.dx = 0;
  }
});

// Start the game loop
requestAnimationFrame(loop);
