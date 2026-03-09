const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d"); // ctx = context for what type of canvas we are using (has different methods)

// Ball drawing
let ballX = canvas.width / 2;
let ballY = canvas.height - 60;
let ballRadius = 10;
let dx = 3; // change in x (speed and direction)
let dy = -3; // change in y (speed and direction)

// Player Bar drawing
let playBarWidth = 120;
let playBarHeight = 15;
let playBarX = (canvas.width - playBarWidth) / 2; // center the player bar horizontally
let playBarY = canvas.height - 45; // position the player bar near the bottom of the canvas
let playBarSpeed = 3; // speed of the player bar movement

// Controls (player movement)
let leftPressed = false;
let rightPressed = false;
document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);


// functions
function drawBall() {
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "aliceblue";
    ctx.fill();
    ctx.closePath();
}

function drawPlayBar() {
    ctx.fillStyle = "aliceblue";
    ctx.fillRect(playBarX, playBarY, playBarWidth, playBarHeight);
}

function keyDownHandler(event) {
    if (event.key === "Left" || event.key === "ArrowLeft") {
        leftPressed = true;
    }
    else if (event.key === "Right" || event.key === "ArrowRight") {
        rightPressed = true;
    }
}

function keyUpHandler(event) {
    if (event.key === "Left" || event.key === "ArrowLeft") {
        leftPressed = false;
    }
    else if (event.key === "Right" || event.key === "ArrowRight") {
        rightPressed = false;
    }
}


// game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // clear the canvas before drawing the next frame

    drawBall();
    drawPlayBar();

    if (
        ballX >= paddleX &&
        ballX <= paddleX + paddleWidth &&
        ballY + ballRadius >= paddleY &&
        ballY + ballRadius <= paddleY + paddleHeight
    ) {
        dy = -dy; // reverse vertical direction on bounce with the player bar
    }

    if (leftPressed && playBarX > 0) {
        playBarX -= playBarSpeed; // move left
    }

    if (rightPressed && playBarX + playBarWidth < canvas.width) {
        playBarX += playBarSpeed; // move right
    }

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