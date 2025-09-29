
// snake.js
// Classic Snake Game implementation using HTML5 Canvas

// Get the canvas element and its drawing context
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

// Size of each grid cell
const grid = 20;

// Snake is represented as an array of segments (objects with x, y coordinates)
let snake = [{ x: 160, y: 200 }];

// Initial direction of the snake
let direction = 'right';

// Food position
let food = { x: 0, y: 0 };

// Player's score
let score = 0;

// Obstacles: array of objects with x, y coordinates
const obstacles = [
    { x: 100, y: 100 },
    { x: 200, y: 100 },
    { x: 300, y: 200 }
]; // You can add more obstacles here

// Place food at a random position on the grid
function placeFood() {
    food.x = Math.floor(Math.random() * (canvas.width / grid)) * grid;
    food.y = Math.floor(Math.random() * (canvas.height / grid)) * grid;
}

// Draw everything on the canvas
function draw() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw obstacles
    ctx.fillStyle = 'gray';
    obstacles.forEach(ob => ctx.fillRect(ob.x, ob.y, grid, grid));

    // Draw the food
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, grid, grid);

    // Draw the snake
    ctx.fillStyle = 'lime';
    snake.forEach(segment => ctx.fillRect(segment.x, segment.y, grid, grid));

    // Draw the score
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText('Score: ' + score, 10, 390);
}

// Move the snake in the current direction
function moveSnake() {
    // Create a new head based on the current direction
    const head = { ...snake[0] };
    if (direction === 'right') head.x += grid;
    if (direction === 'left') head.x -= grid;
    if (direction === 'up') head.y -= grid;
    if (direction === 'down') head.y += grid;

    // Wrap around walls
    if (head.x < 0) head.x = canvas.width - grid;
    if (head.x >= canvas.width) head.x = 0;
    if (head.y < 0) head.y = canvas.height - grid;
    if (head.y >= canvas.height) head.y = 0;

    // Check for collision with obstacles
    if (obstacles.some(ob => ob.x === head.x && ob.y === head.y)) {
        resetGame();
        return;
    }

    // Check for collision with itself
    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        resetGame();
        return;
    }

    // Add new head to the snake
    snake.unshift(head);

    // Check if snake has eaten the food
    if (head.x === food.x && head.y === food.y) {
        score++;
        placeFood(); // Place new food
    } else {
        // Remove the tail segment if no food eaten
        snake.pop();
    }
}

// Reset the game to initial state
function resetGame() {
    snake = [{ x: 160, y: 200 }];
    direction = 'right';
    score = 0;
    placeFood();
}

// Listen for keyboard events to change direction
// Prevent the snake from reversing directly
// (e.g., can't go from left to right immediately)
document.addEventListener('keydown', e => {
    if (e.key === 'ArrowUp' && direction !== 'down') direction = 'up';
    if (e.key === 'ArrowDown' && direction !== 'up') direction = 'down';
    if (e.key === 'ArrowLeft' && direction !== 'right') direction = 'left';
    if (e.key === 'ArrowRight' && direction !== 'left') direction = 'right';
});

// Main game loop: move the snake and redraw everything
function gameLoop() {
    moveSnake();
    draw();
}

// Start the game by placing the first food
placeFood();

// Run the game loop every 100 milliseconds
setInterval(gameLoop, 100);
