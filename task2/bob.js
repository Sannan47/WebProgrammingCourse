let bow = document.getElementById("bow");
const timer = document.getElementById("timer");
let timeLeft = 30;

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
    const formattedSeconds = remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds;

    return `${formattedMinutes}:${formattedSeconds}`;
}

const countdownTimer = setInterval(function() {
    if (timeLeft <= 0) {
        clearInterval(countdownTimer);
        timer.innerHTML = "Time's Up!";
    } else {
        timer.innerHTML = formatTime(timeLeft);
        timeLeft -= 1;
    }
}, 1000);




function getIconCenter(element) {
    const rect = element.getBoundingClientRect();
    return {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
    };
}

document.addEventListener("mousemove", (event) => {
    const center = getIconCenter(bow);
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    const radians = Math.atan2(mouseY - center.y, mouseX - center.x); 
    const degree = radians * (180 / Math.PI); 

    bow.style.transform = `translateY(-50%) rotate(${degree}deg)`; 
});