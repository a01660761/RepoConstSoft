const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d"); // ctx = context for what type of canvas we are using (has different methods)

// Ball drawing
let ballX = canvas.width / 2;
let ballY = canvas.height - 60;
let ballRadius = 10;
let dx = 3; // change in x (speed and direction)
let dy = -3; // change in y (speed and direction)

function drawBall() {
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "aliceblue";
    ctx.fill();
    ctx.closePath();
}

// game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // clear the canvas before drawing the next frame

    drawBall();

    if (ballX + ballRadius > canvas.width || ballX - ballRadius < 0) {
        dx = -dx; // reverse horizontal direction
    }

    if (ballY + ballRadius > canvas.height || ballY - ballRadius < 0) {
        dy = -dy; // reverse vertical direction
    }

    ballX += dx;
    ballY += dy;

    requestAnimationFrame(gameLoop); // call gameLoop again to create a loop
}

gameLoop(); // start the game loop