const canvas = document.getElementById("tetrisCanvas");
const ctx = canvas.getContext("2d");

const ROWS = 20;
const COLUMNS = 10;
const BLOCK_SIZE = 30;

const board = [];
for (let row = 0; row < ROWS; row++) {
  board[row] = [];
  for (let col = 0; col < COLUMNS; col++) {
    board[row][col] = 0;
  }
}

const colors = [
  "#FF0000", // Red
  "#00FF00", // Green
  "#0000FF", // Blue
  "#FFFF00", // Yellow
];

function drawSquare(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
  ctx.strokeStyle = "#000";
  ctx.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
}

function drawBoard() {
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLUMNS; col++) {
      if (board[row][col] !== 0) {
        drawSquare(col, row, colors[board[row][col] - 1]);
      }
    }
  }
}

class TetrisBlock {
  constructor() {
    this.randomizeBlock();
  }

  randomizeBlock() {
    const blockShapes = [
      [[1, 1, 1, 1]], // I Block
      [[1, 1, 1], [1, 0, 0]], // L Block
      [[1, 1, 1], [0, 0, 1]], // J Block
      [[1, 1], [1, 1]], // O Block
      [[1, 1, 1], [0, 1, 0]], // T Block
    ];

    const randomIndex = Math.floor(Math.random() * blockShapes.length);
    this.shape = blockShapes[randomIndex];
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.row = 0;
    this.col = Math.floor(COLUMNS / 2) - Math.floor(this.shape[0].length / 2);
  }

  draw() {
    for (let i = 0; i < this.shape.length; i++) {
      for (let j = 0; j < this.shape[i].length; j++) {
        if (this.shape[i][j] !== 0) {
          drawSquare(this.col + j, this.row + i, this.color);
        }
      }
    }
  }

  moveDown() {
    if (!this.isCollisionWithBoard(0, 1)) {
      this.row++;
    } else {
      mergeBlock(this); // Merge the block into the board
      clearRows(); // Clear any filled rows
      this.randomizeBlock(); // Generate a new block
      if (checkCollision(this)) {
        // Game over logic
        gameover = true;
        console.log("Game Over!");
        // Add your game over handling here.
      }
    }
  }

  moveLeft() {
    if (!this.isCollisionWithBoard(-1, 0)) {
      this.col--;
    }
  }

  moveRight() {
    if (!this.isCollisionWithBoard(1, 0)) {
      this.col++;
    }
  }

  moveUp() {
    if (!this.isCollisionWithBoard(0, -1)) {
      this.row--;
    }
  }

  rotate() {
    const originalShape = this.shape;
    const rotatedShape = originalShape[0].map((_, i) =>
      originalShape.map((row) => row[i]).reverse()
    );

    this.shape = rotatedShape;
  }

  isCollisionWithBoard(offsetCol, offsetRow) {
    for (let i = 0; i < this.shape.length; i++) {
      for (let j = 0; j < this.shape[i].length; j++) {
        if (
          this.shape[i][j] !== 0 &&
          (board[this.row + i + offsetRow] === undefined ||
            board[this.row + i + offsetRow][this.col + j + offsetCol] === undefined ||
            board[this.row + i + offsetRow][this.col + j + offsetCol] !== 0)
        ) {
          return true; // Collision occurred
        }
      }
    }
    return false; // No collision
  }
}

const FALL_SPEED = 200; // milliseconds per move down
const tetrisBlocks = [];

let gameover = false;

document.addEventListener("keydown", handleKeyPress);

function handleKeyPress(event) {
  if (gameover) return;

  switch (event.key) {
    case "ArrowUp":
      tetrisBlocks[0].rotate();
      break;
    case "ArrowDown":
      tetrisBlocks[0].moveDown();
      break;
    case "ArrowLeft":
      tetrisBlocks[0].moveLeft();
      break;
    case "ArrowRight":
      tetrisBlocks[0].moveRight();
      break;
  }
}

function checkCollision(tetrisBlock) {
  for (let i = 0; i < tetrisBlock.shape.length; i++) {
    for (let j = 0; j < tetrisBlock.shape[i].length; j++) {
      if (
        tetrisBlock.shape[i][j] !== 0 &&
        (board[tetrisBlock.row + i] === undefined ||
          board[tetrisBlock.row + i][tetrisBlock.col + j] === undefined ||
          board[tetrisBlock.row + i][tetrisBlock.col + j] !== 0)
      ) {
        return true; // Collision occurred
      }
    }
  }
  return false; // No collision
}

function mergeBlock(tetrisBlock) {
  for (let i = 0; i < tetrisBlock.shape.length; i++) {
    for (let j = 0; j < tetrisBlock.shape[i].length; j++) {
      if (tetrisBlock.shape[i][j] !== 0) {
        board[tetrisBlock.row + i][tetrisBlock.col + j] = tetrisBlock.shape[i][j];
      }
    }
  }
}

function clearRows() {
  for (let row = ROWS - 1; row >= 0; row--) {
    if (board[row].every((cell) => cell !== 0)) {
      // If the row is completely filled
      board.splice(row, 1); // Remove the row
      board.unshift(new Array(COLUMNS).fill(0)); // Add an empty row at the top
    }
  }
}

function createNewBlock() {
  const newBlock = new TetrisBlock();
  tetrisBlocks.unshift(newBlock);
}

function update() {
  const currentBlock = tetrisBlocks[0];
  currentBlock.moveDown();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBoard();
  for (const tetrisBlock of tetrisBlocks) {
    tetrisBlock.draw();
  }

  if (!gameover) {
    update(); // Add update logic
  }
}

// Initialize the game with the first block
createNewBlock();

// Use setInterval for controlling the speed
setInterval(draw, FALL_SPEED);








