let canvas, ctx, cellSize, direction, gameState, gameLoop;

document.addEventListener('DOMContentLoaded', () => {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    cellSize = 20;
    direction = 'right';

    document.addEventListener('keydown', event => {
        handleKeyPress(event);
    });

    canvas.addEventListener('touchstart', handleTouch);
    canvas.addEventListener('touchmove', handleTouch);  // To handle continuous touch movement
});

function handleKeyPress(event) {
    const keyDirections = {
        'ArrowLeft': 'left',
        'ArrowRight': 'right',
        'ArrowUp': 'up',
        'ArrowDown': 'down'
    };

    if (keyDirections[event.key] && direction !== getOppositeDirection(keyDirections[event.key])) {
        changeDirection(keyDirections[event.key]);
    }
}

function getOppositeDirection(dir) {
    const opposites = {
        'left': 'right',
        'right': 'left',
        'up': 'down',
        'down': 'up'
    };
    return opposites[dir];
}

function changeDirection(newDirection) {
    // 同步direction变量以便更新方向
    direction = newDirection;
    // 在Python侧也更新方向
    pyodide.runPythonAsync(`update_game('${direction}')`).then(state => {
        gameState = JSON.parse(state);
        draw();
    });
}

async function startGame() {
    if (gameLoop) {
        clearInterval(gameLoop);
    }
    gameState = JSON.parse(await pyodide.runPythonAsync('reset_game()'));
    gameLoop = setInterval(gameStep, 100);  // 设置更短的时间间隔以提高响应速度
}

async function gameStep() {
    gameState = JSON.parse(await pyodide.runPythonAsync(`update_game('${direction}')`));
    draw();

    if (gameState.game_over) {
        alert('Game Over');
        clearInterval(gameLoop);
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'green';
    gameState.snake.forEach(segment => {
        ctx.fillRect(segment.x * cellSize, segment.y * cellSize, cellSize, cellSize);
    });

    ctx.fillStyle = 'red';
    ctx.fillRect(gameState.apple.x * cellSize, gameState.apple.y * cellSize, cellSize, cellSize);
}

function handleTouch(event) {
    event.preventDefault();
    const touch = event.touches[0];
    const touchX = touch.clientX - canvas.getBoundingClientRect().left;
    const touchY = touch.clientY - canvas.getBoundingClientRect().top;

    pyodide.runPythonAsync(`update_touch(${touchX}, ${touchY})`).then(state => {
        gameState = JSON.parse(state);
        draw();
    });
}