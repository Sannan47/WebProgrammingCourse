const bow = document.getElementById("bow");
const target = document.getElementById("target");
const scoreDisplay = document.getElementById("score");
const timerDisplay = document.getElementById("timer");
const arrowsDisplay = document.getElementById("arrows");
const gameArea = document.getElementById("game-area");
const gameOverScreen = document.getElementById("game-over");
const finalScoreDisplay = document.getElementById("final-score");
const restartBtn = document.getElementById("restart-btn");

let score = 0;
let timeLeft = 30;
let arrowsLeft = 11;
let gameOver = false;
let targetSpeed = 3;
let targetSize = 100;
let countdownTimer;
let targetMovement;
let targetY = 200;
let targetDirection = 1;

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
    const formattedSeconds = remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds;
    return `${formattedMinutes}:${formattedSeconds}`;
}

function startTimer() {
    countdownTimer = setInterval(() => {
        if (timeLeft <= 0) {
            endGame();
        } else {
            timeLeft -= 1;
            timerDisplay.textContent = formatTime(timeLeft);
        }
    }, 1000);
}

function moveTarget() {
    targetMovement = setInterval(() => {
        if (!gameOver) {
            const maxY = window.innerHeight - targetSize - 100;
            const minY = 100;
            
            targetY += targetSpeed * targetDirection;
            
            if (targetY >= maxY) {
                targetY = maxY;
                targetDirection = -1;
            } else if (targetY <= minY) {
                targetY = minY;
                targetDirection = 1;
            }
            
            target.style.top = targetY + "px";
        }
    }, 20);
}

function updateScore() {
    score += 10;
    scoreDisplay.textContent = score;
    
    target.style.transform = "scale(1.2)";
    setTimeout(() => {
        target.style.transform = "scale(1)";
    }, 200);
}

function increaseDifficulty() {
    if (score % 50 === 0 && score > 0) {
        targetSpeed += 1;
        if (targetSize > 60) {
            targetSize -= 5;
            target.style.width = targetSize + "px";
            target.style.height = targetSize + "px";
        }
    }
}

function checkCollision(arrow, target) {
    const arrowRect = arrow.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    
    return !(
        arrowRect.right < targetRect.left ||
        arrowRect.left > targetRect.right ||
        arrowRect.bottom < targetRect.top ||
        arrowRect.top > targetRect.bottom
    );
}

function shootArrow(clickX, clickY) {
    if (gameOver || arrowsLeft <= 0) return;
    
    arrowsLeft -= 1;
    arrowsDisplay.textContent = arrowsLeft;
    
    const arrow = document.createElement("div");
    arrow.className = "arrow";
    
    const bowRect = bow.getBoundingClientRect();
    const startX = bowRect.left + bowRect.width;
    const startY = bowRect.top + bowRect.height / 2;
    
    arrow.style.left = startX + "px";
    arrow.style.top = startY + "px";
    
    const angle = Math.atan2(clickY - startY, clickX - startX);
    arrow.style.transform = `rotate(${angle}rad)`;
    
    gameArea.appendChild(arrow);
    
    const speed = 20;
    const dx = Math.cos(angle) * speed;
    const dy = Math.sin(angle) * speed;
    
    let arrowX = startX;
    let arrowY = startY;
    let hit = false;
    
    const arrowInterval = setInterval(() => {
        arrowX += dx;
        arrowY += dy;
        
        arrow.style.left = arrowX + "px";
        arrow.style.top = arrowY + "px";
        
        if (checkCollision(arrow, target) && !hit) {
            hit = true;
            updateScore();
            increaseDifficulty();
            clearInterval(arrowInterval);
            arrow.remove();
        }
        
        if (arrowX > window.innerWidth || arrowX < 0 || 
            arrowY > window.innerHeight || arrowY < 0) {
            clearInterval(arrowInterval);
            arrow.remove();
        }
    }, 20);
    
    if (arrowsLeft === 0) {
        endGame();
    }
}

function endGame() {
    gameOver = true;
    clearInterval(countdownTimer);
    clearInterval(targetMovement);
    finalScoreDisplay.textContent = score;
    gameOverScreen.classList.remove("hidden");
}

function restartGame() {
    score = 0;
    timeLeft = 30;
    arrowsLeft = 11;
    gameOver = false;
    targetSpeed = 3;
    targetSize = 100;
    targetY = 200;
    targetDirection = 1;
    
    scoreDisplay.textContent = score;
    timerDisplay.textContent = formatTime(timeLeft);
    arrowsDisplay.textContent = arrowsLeft;
    target.style.width = targetSize + "px";
    target.style.height = targetSize + "px";
    
    gameOverScreen.classList.add("hidden");
    
    const arrows = document.querySelectorAll(".arrow");
    arrows.forEach(arrow => arrow.remove());
    
    startTimer();
    moveTarget();
}

gameArea.addEventListener("click", (event) => {
    if (event.target === target) {
        return;
    }
    shootArrow(event.clientX, event.clientY);
});

target.addEventListener("click", (event) => {
    event.stopPropagation();
    shootArrow(event.clientX, event.clientY);
});

restartBtn.addEventListener("click", restartGame);

function getBowCenter(element) {
    const rect = element.getBoundingClientRect();
    return {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
    };
}

document.addEventListener("mousemove", (event) => {
    const center = getBowCenter(bow);
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    const radians = Math.atan2(mouseY - center.y, mouseX - center.x);
    const degree = radians * (180 / Math.PI);

    bow.style.transform = `translateY(-50%) rotate(${degree}deg)`;
});

startTimer();
moveTarget();