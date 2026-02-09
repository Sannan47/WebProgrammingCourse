// DOM Element Selection
const gameArea = document.getElementById('gameArea');
const target = document.getElementById('target');
const bow = document.getElementById('bow');
const arrowsContainer = document.getElementById('arrowsContainer');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const levelDisplay = document.getElementById('level');
const shootBtn = document.getElementById('shootBtn');
const startBtn = document.getElementById('startBtn');
const gameOverlay = document.getElementById('gameOverlay');
const overlayTitle = document.getElementById('overlayTitle');
const overlayMessage = document.getElementById('overlayMessage');
const finalScoreDisplay = document.getElementById('finalScore');
const restartBtn = document.getElementById('restartBtn');

// Game State Variables
let score = 0;
let timeLeft = 60;
let gameActive = false;
let canShoot = true;
let timerInterval = null;
let targetMoveInterval = null;
let currentLevel = 1;

// Game Configuration
const INITIAL_TIME = 60;
const ARROW_SPEED = 1000; // milliseconds
const BASE_TARGET_SPEED = 2000; // milliseconds
const DIFFICULTY_THRESHOLD = 5; // points per level increase

// Target Movement Variables
let targetX = 0;
let targetY = 0;
let targetSpeedMultiplier = 1;

// Initialize Game
const initGame = () => {
    score = 0;
    timeLeft = INITIAL_TIME;
    currentLevel = 1;
    targetSpeedMultiplier = 1;
    updateScore();
    updateTimer();
    updateLevel();
    hideGameOverlay();
    clearArrows();
    resetTargetPosition();
};

// Start Game
const startGame = () => {
    if (gameActive) return;
    
    initGame();
    gameActive = true;
    canShoot = true;
    
    startBtn.textContent = 'Game Running...';
    startBtn.disabled = true;
    shootBtn.disabled = false;
    
    startTimer();
    startTargetMovement();
};

// Start Timer
const startTimer = () => {
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimer();
        
        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);
};

// Stop Timer
const stopTimer = () => {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
};

// Update Timer Display
const updateTimer = () => {
    timerDisplay.textContent = timeLeft;
    
    // Change color based on remaining time
    if (timeLeft <= 10) {
        timerDisplay.style.color = '#e74c3c';
    } else if (timeLeft <= 30) {
        timerDisplay.style.color = '#f39c12';
    } else {
        timerDisplay.style.color = '#3498db';
    }
};

// Update Score Display
const updateScore = () => {
    scoreDisplay.textContent = score;
    checkDifficultyIncrease();
};

// Update Level Display
const updateLevel = () => {
    levelDisplay.textContent = currentLevel;
};

// Check and Increase Difficulty
const checkDifficultyIncrease = () => {
    const newLevel = Math.floor(score / DIFFICULTY_THRESHOLD) + 1;
    
    if (newLevel > currentLevel) {
        currentLevel = newLevel;
        updateLevel();
        increaseDifficulty();
    }
};

// Increase Game Difficulty
const increaseDifficulty = () => {
    // Increase target speed
    targetSpeedMultiplier = 1 + (currentLevel - 1) * 0.3;
    
    // Decrease target size
    const newSize = Math.max(60, 100 - (currentLevel - 1) * 8);
    target.style.width = `${newSize}px`;
    target.style.height = `${newSize}px`;
    
    // Change target color for visual feedback
    const colors = ['#e74c3c', '#9b59b6', '#e67e22', '#16a085', '#c0392b'];
    const colorIndex = (currentLevel - 1) % colors.length;
    const outerRing = target.querySelector('.ring-outer');
    outerRing.style.background = colors[colorIndex];
    
    // Restart target movement with new speed
    stopTargetMovement();
    startTargetMovement();
};

// Start Target Movement
const startTargetMovement = () => {
    moveTarget(); // Initial move
    
    const speed = BASE_TARGET_SPEED / targetSpeedMultiplier;
    targetMoveInterval = setInterval(() => {
        moveTarget();
    }, speed);
};

// Stop Target Movement
const stopTargetMovement = () => {
    if (targetMoveInterval) {
        clearInterval(targetMoveInterval);
        targetMoveInterval = null;
    }
};

// Move Target to Random Position
const moveTarget = () => {
    if (!gameActive) return;
    
    const gameAreaRect = gameArea.getBoundingClientRect();
    const targetSize = parseInt(target.style.width) || 100;
    
    // Calculate boundaries (keep target within game area and away from bow)
    const minX = 300; // Keep away from bow on left side
    const maxX = gameAreaRect.width - targetSize - 20;
    const minY = 20;
    const maxY = gameAreaRect.height - targetSize - 20;
    
    // Generate random position
    targetX = Math.random() * (maxX - minX) + minX;
    targetY = Math.random() * (maxY - minY) + minY;
    
    // Apply position with smooth transition
    target.style.left = `${targetX}px`;
    target.style.top = `${targetY}px`;
    target.style.transform = 'none';
};

// Reset Target Position
const resetTargetPosition = () => {
    target.style.width = '100px';
    target.style.height = '100px';
    targetX = gameArea.offsetWidth - 200;
    targetY = (gameArea.offsetHeight - 100) / 2;
    target.style.left = `${targetX}px`;
    target.style.top = `${targetY}px`;
    target.style.transform = 'none';
};

// Shoot Arrow
const shootArrow = () => {
    if (!gameActive || !canShoot) return;
    
    canShoot = false;
    shootBtn.disabled = true;
    
    // Create arrow element
    const arrow = document.createElement('div');
    arrow.className = 'arrow';
    
    // Position arrow at bow
    const bowRect = bow.getBoundingClientRect();
    const gameAreaRect = gameArea.getBoundingClientRect();
    const arrowStartX = bowRect.right - gameAreaRect.left;
    const arrowStartY = bowRect.top + bowRect.height / 2 - gameAreaRect.top;
    
    arrow.style.left = `${arrowStartX}px`;
    arrow.style.top = `${arrowStartY}px`;
    
    arrowsContainer.appendChild(arrow);
    
    // Get target position
    const targetRect = target.getBoundingClientRect();
    const targetCenterX = targetRect.left + targetRect.width / 2 - gameAreaRect.left;
    const targetCenterY = targetRect.top + targetRect.height / 2 - gameAreaRect.top;
    
    // Animate arrow towards target
    setTimeout(() => {
        arrow.style.left = `${targetCenterX}px`;
        arrow.style.top = `${targetCenterY}px`;
    }, 50);
    
    // Check for collision after animation
    setTimeout(() => {
        checkCollision(arrow, targetCenterX, targetCenterY);
        
        // Remove arrow after animation
        setTimeout(() => {
            arrow.remove();
            canShoot = true;
            if (gameActive) {
                shootBtn.disabled = false;
            }
        }, 500);
    }, ARROW_SPEED);
};

// Check Collision between Arrow and Target
const checkCollision = (arrow, arrowX, arrowY) => {
    const targetRect = target.getBoundingClientRect();
    const gameAreaRect = gameArea.getBoundingClientRect();
    
    const targetCenterX = targetRect.left + targetRect.width / 2 - gameAreaRect.left;
    const targetCenterY = targetRect.top + targetRect.height / 2 - gameAreaRect.top;
    const targetRadius = targetRect.width / 2;
    
    // Calculate distance between arrow tip and target center
    const distance = Math.sqrt(
        Math.pow(arrowX - targetCenterX, 2) + 
        Math.pow(arrowY - targetCenterY, 2)
    );
    
    // Check if arrow hit the target
    if (distance <= targetRadius) {
        handleHit();
    } else {
        handleMiss();
    }
};

// Handle Successful Hit
const handleHit = () => {
    // Increase score based on level
    const points = currentLevel;
    score += points;
    updateScore();
    
    // Visual feedback
    target.classList.add('hit-effect');
    setTimeout(() => {
        target.classList.remove('hit-effect');
    }, 300);
    
    // Move target to new position immediately after hit
    moveTarget();
};

// Handle Miss
const handleMiss = () => {
    // Visual feedback for miss
    gameArea.classList.add('miss-effect');
    setTimeout(() => {
        gameArea.classList.remove('miss-effect');
    }, 300);
};

// Clear All Arrows
const clearArrows = () => {
    arrowsContainer.innerHTML = '';
};

// End Game
const endGame = () => {
    gameActive = false;
    canShoot = false;
    
    stopTimer();
    stopTargetMovement();
    
    shootBtn.disabled = true;
    startBtn.disabled = false;
    startBtn.textContent = 'Start Game';
    
    showGameOverlay();
};

// Show Game Over Overlay
const showGameOverlay = () => {
    overlayTitle.textContent = 'Game Over!';
    overlayMessage.innerHTML = `Your final score: <span id="finalScore">${score}</span>`;
    finalScoreDisplay.textContent = score;
    gameOverlay.classList.remove('hidden');
};

// Hide Game Overlay
const hideGameOverlay = () => {
    gameOverlay.classList.add('hidden');
};

// Restart Game
const restartGame = () => {
    hideGameOverlay();
    startGame();
};

// Event Listeners
startBtn.addEventListener('click', startGame);
shootBtn.addEventListener('click', shootArrow);
restartBtn.addEventListener('click', restartGame);

// Keyboard Controls
document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        event.preventDefault(); // Prevent page scroll
        shootArrow();
    }
    
    if (event.code === 'Enter' && !gameActive) {
        startGame();
    }
});

// Prevent target click from shooting
target.addEventListener('click', (event) => {
    event.stopPropagation(); // Prevent event bubbling
});

// Optional: Click on game area to shoot (alternative control)
gameArea.addEventListener('click', (event) => {
    // Only shoot if clicking on game area background, not on target or other elements
    if (event.target === gameArea) {
        shootArrow();
    }
});

// Initialize display on page load
window.addEventListener('load', () => {
    initGame();
    shootBtn.disabled = true;
});
