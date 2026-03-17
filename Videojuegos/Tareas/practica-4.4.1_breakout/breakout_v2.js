/*
* BRICKWALL FLASH - Breakout Game Exercise v2
*
* Manuel Montero - A01660761
*
*
*/

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d"); // ctx = context for what type of canvas we are using (has different methods)

class Ball {
    constructor(canvasWidth, canvasHeight) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.radius = 10;
        this.reset();
    }

    reset() {
        this.x = this.canvasHeight / 2;
        this.y = this.canvasHeight - 60;
        this .dx = 2; // change in x (speed and direction)
        this.dy = -2; // change in y (speed and direction)
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = "aliceblue";
        ctx.fill();
        ctx.closePath();
    }

    // update ball position
    ballMovement() {
        this.x += this.dx;
        this.y += this.dy;
    }
}



class Paddle {
    constructor(canvasWidth, canvasHeight) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.height = 15;
        this.width = 120;
        this.speed = 2.5; // speed of the player bar movement
        this.reset();
    }

    reset() {
        this.x = (this.canvasWidth - this.width) / 2; // center the player bar horizontally
        this.y = this.canvasHeight - 45; // position the player bar near the bottom of the canvas
    }

    draw(ctx) {
        ctx.fillStyle = "aliceblue";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    goLeft() { // left movement with boundary check
        if (this.x > 0){
            this.x -= this.speed; // move left
        }
    }

    goRight() { // right movement with boundary check
        if (this.x + this.width < this.canvasWidth) {
            this.x += this.speed; // move right
        }
    }
}



class brickWall {
    constructor(rows, columns, width, height, spacing, spaceTop, spaceLeft) {
        this.rows = rows;
        this.columns = columns;
        this.brickWidth = width;
        this.brickHeight = height;
        this.spacing = spacing;
        this.spaceTop = spaceTop;
        this.spaceLeft = spaceLeft;
        this.bricks = [];
        this.spawnBricks();
    }

    spawnBricks() {
        this.bricks = [];

        for (let i = 0; i < this.columns; i++) {
            this.bricks[i] = [];
            for (let j = 0; j < this.rows; j++) {
                this.bricks[i][j] = {x: 0, y: 0, status: 1}; // status 1 = brick available (this is an objetc)
            }
        }
    }

    reset() {
        this.spawnBricks();
    }

    draw(ctx) {
        for (let i = 0; i < this.columns; i++) {
            for (let j = 0; j < this.rows; j++) {
                if (this.bricks[i][j].status === 1) { // only draw the brick if its status is 1 (visible)
                    let brickX = i * (this.brickWidth + this.spacing) + this.spaceLeft;
                    let brickY = j * (this.brickHeight + this.spacing) + this.spaceTop;

                    this.bricks[i][j].x = brickX; // store the x position of the brick
                    this.bricks[i][j].y = brickY; // store the y position of the brick

                    ctx.fillStyle = "red";
                    ctx.fillRect(brickX, brickY, this.brickWidth, this.brickHeight);
                }
            }
        }
    }

    ballCollision(ball) {
        let bricksDestroyed = 0;

        for (let i = 0; i < this.columns; i++) {
            for (let j = 0; j < this.rows; j++) {
                let br = this.bricks[i][j];

                if (br.status === 1) {
                    if (ball.x + ball.radius > br.x && 
                        ball.x - ball.radius < br.x + this.brickWidth && 
                        ball.y + ball.radius > br.y &&
                        ball.y - ball.radius < br.y + this.brickHeight
                    ) {
                        ball.dy = -ball.dy; // reverse vertical direction on bounce with the brick
                        br.status = 0; // destroyed brick
                        bricksDestroyed++;
                    }
                }
            }
        }

        return bricksDestroyed;
    }

    totalBricks() {
        return this.columns * this.rows;
    }
}

class game {
    constructor (canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;

        this.ball = new Ball(canvas.width, canvas.height);
        this.paddle = new Paddle(canvas.width, canvas.height);
        this.brickWall = new brickWall(5, 8, 75, 20, 10, 30, 35); // rows, columns, width, height, spacing, spaceTop, spaceLeft

        this.leftPressed = false;
        this.rightPressed = false;

        this.lives = 3;
        this.destroyedBlocks = 0;
        this.gameState = "playing";

        this.eventSetup();
    }

    eventSetup() {
        document.addEventListener("keyup", (event) => this.keyUpHandler(event));
        document.addEventListener("keydown", (event) => this.keyDownHandler(event));
    }

    keyDownHandler(event) {
        if (event.code === "Space") {
            if (this.gameState === "gameover" || this.gameState === "win") {
                this.resetGame();
                this.gameState = "playing";
            }
        }
        
        if (event.key === "Left" || event.key === "ArrowLeft") {
            this.leftPressed = true;
        }
        else if (event.key === "Right" || event.key === "ArrowRight") {
            this.rightPressed = true;
        }
    }

    keyUpHandler(event) {
        if (event.key === "Left" || event.key === "ArrowLeft") {
            this.leftPressed = false;
        }
        else if (event.key === "Right" || event.key === "ArrowRight") {
            this.rightPressed = false;
        }
    }

    partialResetGame() {
        this.ball.reset();
        this.paddle.reset();
        this.leftPressed = false;
        this.rightPressed = false;
    }

    resetGame() {
        this.lives = 3;
        this.destroyedBlocks = 0;
        this.partialResetGame();
        this.brickWall.reset();
    }


    drawLives() {
        ctx.font = "20px Arial";
        ctx.fillStyle = "aliceblue";
        ctx.fillText("Lives: " + this.lives, 20, 320);
    }

    drawScore() {
        ctx.font = "20px Arial";
        ctx.fillStyle = "aliceblue";
        ctx.fillText("Blocks Destroyed: " + this.destroyedBlocks, 20, 350);
    }

    drawGameOverlay(text, color) {
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.5)"; // semi-transparent black background
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.font = "bold 70px Arial";
        this.ctx.fillStyle = color;
        this.ctx.textAlign = "center";
        this.ctx.fillText(text, this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.font = "30px Arial";
        this.ctx.fillStyle = "aliceblue";
        this.ctx.fillText("Press SPACE to play again", this.canvas.width / 2, this.canvas.height / 2 + 50);
        this.ctx.textAlign = "left";
    }

    updatePaddle() {
        if (this.leftPressed) {
            this.paddle.goLeft();
        }
        
        if (this.rightPressed) {
            this.paddle.goRight();
        }
    }


    collisionWall() {
        if (
            this.ball.x + this.ball.radius > this.canvas.width ||
            this.ball.x - this.ball.radius < 0
        ) {
            this.ball.dx = -this.ball.dx; // reverse horizontal direction
        }

        if (this.ball.y - this.ball.radius < 0) {
            this.ball.dy = -this.ball.dy; // reverse vertical direction
        }
    }

    collisionPaddle() {
        if (
            this.ball.x >= this.paddle.x &&
            this.ball.x <= this.paddle.x + this.paddle.width &&
            this.ball.y + this.ball.radius >= this.paddle.y &&
            this.ball.y + this.ball.radius <= this.paddle.y + this.paddle.height
        ) {
            this.ball.dy = -this.ball.dy; // reverse vertical direction on bounce with the player bar
        }
    }

    collisionBottom() {
        if (this.ball.y + this.ball.radius > this.canvas.height) {
            this.lives--;

            if (this.lives > 0) {
                this.partialResetGame();
            }

            else {
                this.gameState = "gameover";
                this.lives = 0; // ensure lives don't go negative
            }
        }
    }
    
    winCondition() {
        if (this.destroyedBlocks === this.brickWall.totalBricks()) {
            this.gameState = "win";
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // clear the canvas before drawing the next frame

        this.ball.draw(this.ctx);
        this.paddle.draw(this.ctx);
        this.brickWall.draw(this.ctx);
        this.drawLives();
        this.drawScore();

        if (this.gameState === "win") {
            this.drawGameOverlay("NICE WIN", "#00ff66");
            return;
        }

        if (this.gameState === "gameover") {
            this.drawGameOverlay("GAME OVER", "#ff3b3b");
            return;
        }
    }

    gameStateUpdate() {
        if (this.gameState !== "playing") {
            return;
        }

        this.updatePaddle();
        this.collisionWall();
        this.collisionPaddle();
        this.collisionBottom();

        const bricksDestroyedThisFrame = this.brickWall.ballCollision(this.ball);
        this.destroyedBlocks += bricksDestroyedThisFrame;
        this.winCondition();

        if (this.gameState === "playing") {
            this.ball.ballMovement();
        }
    }

    gameLoop() {
        this.gameStateUpdate();
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }
}

const breakoutGame = new game(canvas, ctx);
breakoutGame.gameLoop();