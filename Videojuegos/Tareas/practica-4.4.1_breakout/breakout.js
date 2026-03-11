const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d"); // ctx = context for what type of canvas we are using (has different methods)

// Ball drawing
let ballX = canvas.width / 2;
let ballY = canvas.height - 60;
let ballRadius = 10;
let dx = 2; // change in x (speed and direction)
let dy = -2; // change in y (speed and direction)

// Player Bar drawing
let playBarWidth = 120;
let playBarHeight = 15;
let playBarX = (canvas.width - playBarWidth) / 2; // center the player bar horizontally
let playBarY = canvas.height - 45; // position the player bar near the bottom of the canvas
let playBarSpeed = 2.5; // speed of the player bar movement

// Controls (player movement)
let leftPressed = false;
let rightPressed = false;
document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

// brick construction
let brickRows = 5;
let brickColumns = 8;
let brickWidth = 100;
let brickHeight = 30;
let brickSpacing = 5;
let brickSpaceTop = 5;
let brickSpaceLeft = -10;


// game status
let gameState = "playing"; // can be "playing", "gameover" or "win"

let lives = 3;
let destroyedBlocks = 0;

let bricksBuilt = [];

function createBricks() {
    bricksBuilt = [];

    for (let i = 0; i < brickColumns; i++) {
        bricksBuilt[i] = [];
        for (let j = 0; j < brickRows; j++) {
            bricksBuilt[i][j] = { x: 0, y: 0, status: 1 }; // status 1 means the brick is still visible
        }
    }
}
createBricks();

function drawGameOverlay(text, color) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)"; // semi-transparent black background
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = "bold 70px Arial";
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);
    ctx.font = "30px Arial";
    ctx.fillStyle = "aliceblue";
    ctx.fillText("Press SPACE to play again", canvas.width / 2, canvas.height / 2 + 50);
    ctx.textAlign = "left";
}




// functions
function partialResetGame() {
    ballX = canvas.width / 2;
    ballY = canvas.height - 60;
    dx = 2;
    dy = -2;

    playBarX = (canvas.width - playBarWidth) / 2;
    playBarY = canvas.height - 45;

    leftPressed = false;
    rightPressed = false;
}

function resetGame() {
    lives = 3;
    destroyedBlocks = 0;
    partialResetGame();
    createBricks();
}

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

function drawLives() {
    ctx.font = "20px Arial";
    ctx.fillStyle = "aliceblue";
    ctx.fillText("Lives: " + lives, 20, 320);
}

function drawBlockScore() {
    ctx.font = "20px Arial";
    ctx.fillStyle = "aliceblue";
    ctx.fillText("Blocks Destroyed: " + destroyedBlocks, 20, 350);
}

function keyDownHandler(event) {
    if (event.code === "Space") {
        if (gameState === "gameover" || gameState === "win") {
            resetGame();
            gameState = "playing";
        }
    }


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

function drawBricks() {
    for (let i = 0; i < brickColumns; i++) {
        for (let j = 0; j < brickRows; j++) {
            if (bricksBuilt[i][j].status === 1) { // only draw the brick if its status is 1 (visible)
                let brickX = i * (brickWidth + brickSpacing) + brickSpaceLeft;
                let brickY = j * (brickHeight + brickSpacing) + brickSpaceTop;

                bricksBuilt[i][j].x = brickX; // store the x position of the brick
                bricksBuilt[i][j].y = brickY; // store the y position of the brick

                ctx.fillStyle = "red";
                ctx.fillRect(brickX, brickY, brickWidth, brickHeight);
            }
        }
    }
}

function collisionBricks() {
    for (let i = 0; i < brickColumns; i++) {
        for (let j = 0; j < brickRows; j++) {
            let br = bricksBuilt[i][j];

            if (br.status === 1) {
                if (ballX + ballRadius > br.x && 
                    ballX - ballRadius < br.x + brickWidth && 
                    ballY + ballRadius > br.y &&
                    ballY - ballRadius< br.y + brickHeight
                ) {
                    dy = -dy; // reverse vertical direction on bounce with the brick
                    br.status = 0; // destroyed brick
                    destroyedBlocks++;
                }
            }
        }
    }
}

// game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // clear the canvas before drawing the next frame

    drawBall();
    drawPlayBar();
    drawBricks();
    drawLives();
    drawBlockScore();
    collisionBricks();

    // check for winning condition
    if (destroyedBlocks === brickRows * brickColumns) {
        gameState = "win";
    }


    // play bar movement
    if (leftPressed && playBarX > 0) {
        playBarX -= playBarSpeed; // move left
    }

    if (rightPressed && playBarX + playBarWidth < canvas.width) {
        playBarX += playBarSpeed; // move right
    }


    // ball movement and collision with walls
    if (ballX + ballRadius > canvas.width || ballX - ballRadius < 0) {
        dx = -dx; // reverse horizontal direction
    }


    // ceiling bounce
    if (ballY - ballRadius < 0) {
        dy = -dy; // reverse vertical direction
    }
    // bar bounce
    else if (
        ballX >= playBarX &&
        ballX <= playBarX + playBarWidth &&
        ballY + ballRadius >= playBarY &&
        ballY + ballRadius <= playBarY + playBarHeight
    ) {
        dy = -dy; // reverse vertical direction on bounce with the player bar
    }

    else if (ballY + ballRadius > canvas.height) {
        lives--;

        if (lives > 0) {
            partialResetGame();
            requestAnimationFrame(gameLoop);
            return;
        }
        else {
            gameState = "gameover";
            lives = 0; // ensure lives don't go negative
        }
    }

    if (gameState === "win") {
        drawGameOverlay("NICE WIN", "#00ff66");
        requestAnimationFrame(gameLoop);
        return;
    }

    if (gameState === "gameover") {
        drawGameOverlay("GAME OVER", "#ff3b3b");
        requestAnimationFrame(gameLoop);
        return;
    }


    // update ball position
    ballX += dx;
    ballY += dy;

    requestAnimationFrame(gameLoop); // call gameLoop again to create a loop

    
}

gameLoop(); // start the game loop