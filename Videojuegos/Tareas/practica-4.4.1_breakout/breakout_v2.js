/*
* BRICKWALL FLASH - Breakout Game Exercise v2
*
* Manuel Montero - A01660761
*
*/

// get canvas and context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");


class Ball {
    constructor(canvasWidth, canvasHeight) {
        this.canvasWidth = canvasWidth; // all classes use the same canvas dimensions, so we can pass them in the constructor
        this.canvasHeight = canvasHeight;
        this.radius = 10;

        this.baseSpeed = 220;
        this.reset(); // sets initial position and speed
    }

    reset() {
        this.x = this.canvasWidth / 2;
        this.y = this.canvasHeight - 60;
        this.dx = this.baseSpeed;
        this.dy = -this.baseSpeed;
    }

    setSpeedMultiplier(multiplier) { // for increasing speed in higher levels while maintaining the direction
        const horizontalDirection = this.dx >= 0 ? 1 : -1;
        const verticalDirection = this.dy >= 0 ? 1 : -1;

        // calculate new speed while keeping the same direction
        this.dx = this.baseSpeed * multiplier * horizontalDirection;
        this.dy = this.baseSpeed * multiplier * verticalDirection;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = "aliceblue";
        ctx.fill();
        ctx.closePath();
    }

    ballMovement(deltaTime) { // using deltaTime to ensure consistent movement across different frame rates
        this.x += this.dx * deltaTime;
        this.y += this.dy * deltaTime;
    }
}


class Paddle {
    constructor(canvasWidth, canvasHeight) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.height = 15;
        this.width = 120;
        this.speed = 420;
        this.reset();
    }

    reset() {
        this.x = (this.canvasWidth - this.width) / 2;
        this.y = this.canvasHeight - 45;
    }

    draw(ctx) {
        ctx.fillStyle = "aliceblue";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    goLeft(deltaTime) {
        this.x -= this.speed * deltaTime;

        if (this.x < 0) { // prevent going out of bounds
            this.x = 0;
        }
    }

    goRight(deltaTime) {
        this.x += this.speed * deltaTime;

        if (this.x + this.width > this.canvasWidth) { // prevent going out of bounds
            this.x = this.canvasWidth - this.width;
        }
    }
}


class BrickWall {
    constructor(rows, columns, width, height, spacing, spaceTop, spaceLeft) {
        this.rows = rows;
        this.columns = columns;
        this.brickWidth = width;
        this.brickHeight = height;
        this.spacing = spacing;
        this.spaceTop = spaceTop;
        this.spaceLeft = spaceLeft;
        this.bricks = [];
        this.rowColors = ["#ff4d4d", "#ff944d", "#ffd24d", "#66ccff", "#b266ff"]; // different colors for each row
        this.spawnBricks(1); // initialize bricks for level 1
    }

    spawnBricks(level = 1) {
        this.bricks = [];

        for (let i = 0; i < this.columns; i++) {
            this.bricks[i] = []; // initialize each column as an empty array

            for (let j = 0; j < this.rows; j++) {
                this.bricks[i][j] = {x: 0, y: 0, status: 1, color: this.rowColors[j % this.rowColors.length], type: "normal"}; // status 1 means the brick is active, 0 means destroyed
            }
        }

        let bonusCount = 0; // determine how many bonus bricks to add based on the level

        if (level === 2) {
            bonusCount = 1;
        } else if (level >= 3) {
            bonusCount = 2;
        }

        while (bonusCount > 0) {
            // generate random column and row indices to select a brick for the bonus
            const randomColumn = Math.floor(Math.random() * this.columns);
            const randomRow = Math.floor(Math.random() * this.rows);
            const selectedBrick = this.bricks[randomColumn][randomRow];

            if (selectedBrick.type === "normal") {
                selectedBrick.type = "life";
                selectedBrick.color = "#00ff66";
                bonusCount--;
            }
        }
    }

    draw(ctx) {
        for (let i = 0; i < this.columns; i++) {
            for (let j = 0; j < this.rows; j++) {
                const brick = this.bricks[i][j]; // get the brick object at the current column and row

                if (brick.status === 1) {
                    // calculate the brick's position
                    const brickX = i * (this.brickWidth + this.spacing) + this.spaceLeft;
                    const brickY = j * (this.brickHeight + this.spacing) + this.spaceTop;

                    brick.x = brickX;
                    brick.y = brickY;

                    ctx.fillStyle = brick.color;
                    ctx.fillRect(brickX, brickY, this.brickWidth, this.brickHeight);
                }
            }
        }
    }

    ballCollision(ball) {
        let bricksDestroyed = 0;
        let livesEarned = 0;

        for (let i = 0; i < this.columns; i++) {
            for (let j = 0; j < this.rows; j++) {
                const brick = this.bricks[i][j];

                if (brick.status === 1) {
                    // check for collision between the ball and the brick using AABB collision detection
                    const hitBrick = ball.x + ball.radius > brick.x &&
                        ball.x - ball.radius < brick.x + this.brickWidth &&
                        ball.y + ball.radius > brick.y &&
                        ball.y - ball.radius < brick.y + this.brickHeight;

                    if (hitBrick) {
                        brick.status = 0;
                        bricksDestroyed++;

                        // for the extra lifes
                        if (brick.type === "life") {
                            livesEarned++;
                        }
                        
                        // determine the side of the collision to reflect the ball's direction accordingly
                        const overlapLeft = (ball.x + ball.radius) - brick.x;
                        const overlapRight = (brick.x + this.brickWidth) - (ball.x - ball.radius);
                        const overlapTop = (ball.y + ball.radius) - brick.y;
                        const overlapBottom = (brick.y + this.brickHeight) - (ball.y - ball.radius);

                        // find the minimum overlap to determine the collision side
                        const minHorizontalOverlap = Math.min(overlapLeft, overlapRight);
                        const minVerticalOverlap = Math.min(overlapTop, overlapBottom);

                        if (minHorizontalOverlap < minVerticalOverlap) {
                            ball.dx = -ball.dx;
                        } 
                        
                        else {
                            ball.dy = -ball.dy;
                        }

                        return {
                            bricksDestroyed,
                            livesEarned
                        };
                    }
                }
            }
        }

        return {
            bricksDestroyed,
            livesEarned
        };
    }

    totalBricks() {
        return this.columns * this.rows;
    }
}


class Game {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;

        this.ball = new Ball(canvas.width, canvas.height);
        this.paddle = new Paddle(canvas.width, canvas.height);
        this.brickWall = new BrickWall(5, 8, 75, 20, 10, 30, 35); // 5 rows, 8 columns, brick width 75, height 20, spacing 10, top space 30, left space 35

        this.leftPressed = false;
        this.rightPressed = false;

        this.level = 1;
        this.maxLevel = 3;

        this.lives = 3;
        this.levelDestroyedBricks = 0;
        this.totalDestroyedBricks = 0;

        this.gameState = "playing";
        this.oldTime = 0; // to calculate deltaTime for consistent movement

        this.setupLevel(this.level);
        this.eventSetup();
    }

    eventSetup() {
        document.addEventListener("keydown", (event) => this.keyDownHandler(event));
        document.addEventListener("keyup", (event) => this.keyUpHandler(event));
    }

    keyDownHandler(event) {
        if (event.code === "Space") {
            if (this.gameState === "gameover" || this.gameState === "win") {
                this.resetGame();
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

    setupLevel(level) {
        this.level = level;
        this.levelDestroyedBricks = 0;

        this.partialResetGame();
        this.brickWall.spawnBricks(level);

        const speedMultiplier = 1 + (level - 1) * 0.2; // increase speed by 20% each level
        this.ball.reset();
        this.ball.setSpeedMultiplier(speedMultiplier);
    }

    // reset the ball and paddle positions and states, but keep the current lives and score for the level progression
    partialResetGame() {
        this.ball.reset();
        this.paddle.reset();
        this.leftPressed = false;
        this.rightPressed = false;
    }

    resetGame() {
        this.lives = 3;
        this.totalDestroyedBricks = 0;
        this.gameState = "playing";
        this.oldTime = 0;
        this.setupLevel(1);
    }

    nextLevel() {
        if (this.level < this.maxLevel) {
            this.setupLevel(this.level + 1);
            this.gameState = "playing";
        } 
        
        else {
            this.gameState = "win";
        }
    }

    drawLives() {
        this.ctx.font = "20px Arial";
        this.ctx.fillStyle = "aliceblue";
        this.ctx.fillText("Lives: " + this.lives, 20, 320);
    }

    drawScore() {
        this.ctx.font = "20px Arial";
        this.ctx.fillStyle = "aliceblue";
        this.ctx.fillText("Level: " + this.level, 20, 350);
        this.ctx.fillText(
            "Bricks Destroyed: " +
            this.levelDestroyedBricks +
            " / " +
            this.brickWall.totalBricks(),
            20,
            380
        );
    }

    drawGameOverlay(text, color) {
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.55)";
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

    updatePaddle(deltaTime) {
        if (this.leftPressed) {
            this.paddle.goLeft(deltaTime);
        }

        if (this.rightPressed) {
            this.paddle.goRight(deltaTime);
        }
    }

    collisionWall() {
        if (this.ball.x + this.ball.radius >= this.canvas.width) {
            this.ball.x = this.canvas.width - this.ball.radius;
            this.ball.dx = -Math.abs(this.ball.dx);
        }

        if (this.ball.x - this.ball.radius <= 0) {
            this.ball.x = this.ball.radius;
            this.ball.dx = Math.abs(this.ball.dx);
        }

        if (this.ball.y - this.ball.radius <= 0) {
            this.ball.y = this.ball.radius;
            this.ball.dy = Math.abs(this.ball.dy);
        }
    }

    collisionPaddle() {
        const ballBottom = this.ball.y + this.ball.radius;
        const ballTop = this.ball.y - this.ball.radius;
        const ballRight = this.ball.x + this.ball.radius;
        const ballLeft = this.ball.x - this.ball.radius;

        const paddleTop = this.paddle.y;
        const paddleBottom = this.paddle.y + this.paddle.height;
        const paddleLeft = this.paddle.x;
        const paddleRight = this.paddle.x + this.paddle.width;

        const isColliding = ballRight >= paddleLeft &&
            ballLeft <= paddleRight &&
            ballBottom >= paddleTop &&
            ballTop <= paddleBottom;

        if (isColliding && this.ball.dy > 0) {
            this.ball.y = this.paddle.y - this.ball.radius;

            const paddleCenter = this.paddle.x + this.paddle.width / 2;
            const hitOffset = this.ball.x - paddleCenter;
            const normalizedOffset = hitOffset / (this.paddle.width / 2);

            const speed = Math.sqrt(this.ball.dx * this.ball.dx + this.ball.dy * this.ball.dy);
            this.ball.dx = normalizedOffset * speed;
            this.ball.dy = -Math.sqrt(speed * speed - this.ball.dx * this.ball.dx);
        }
    }

    collisionBottom() {
        if (this.ball.y - this.ball.radius > this.canvas.height) {
            this.lives--;

            if (this.lives > 0) {
                const speedMultiplier = 1 + (this.level - 1) * 0.2;
                this.partialResetGame();
                this.ball.setSpeedMultiplier(speedMultiplier);
            } else {
                this.lives = 0;
                this.gameState = "gameover";
            }
        }
    }

    winCondition() {
        if (this.levelDestroyedBricks >= this.brickWall.totalBricks()) {
            this.nextLevel();
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ball.draw(this.ctx);
        this.paddle.draw(this.ctx);
        this.brickWall.draw(this.ctx);
        this.drawLives();
        this.drawScore();

        if (this.gameState === "win") {
            this.drawGameOverlay("NICE WIN", "#00ff66");
        }

        if (this.gameState === "gameover") {
            this.drawGameOverlay("GAME OVER", "#ff3b3b");
        }
    }

    gameStateUpdate(deltaTime) {
        if (this.gameState !== "playing") {
            return;
        }

        this.updatePaddle(deltaTime);
        this.ball.ballMovement(deltaTime);

        this.collisionWall();
        this.collisionPaddle();

        const collisionResult = this.brickWall.ballCollision(this.ball);
        this.levelDestroyedBricks += collisionResult.bricksDestroyed;
        this.totalDestroyedBricks += collisionResult.bricksDestroyed;

        if (collisionResult.livesEarned > 0) {
            this.lives += collisionResult.livesEarned;

            if (this.lives > 5) {
                this.lives = 5;
            }
        }

        this.winCondition();
        this.collisionBottom();
    }

    gameLoop(newTime = 0) {
        // calculate deltaTime for consistent movement across different frame rates
        const deltaTime = (newTime - this.oldTime) / 1000;
        this.oldTime = newTime;

        // cap deltaTime to prevent issues when the game is paused or lags
        const safeDeltaTime = Math.min(deltaTime, 0.03); // cap at 30ms to prevent large jumps

        // use safeDeltaTime for all movement and collision calculations to ensure consistent behavior
        this.gameStateUpdate(safeDeltaTime);
        this.draw();

        // use requestAnimationFrame for smoother animations and better performance
        requestAnimationFrame((time) => this.gameLoop(time));
    }
}


const breakoutGame = new Game(canvas, ctx);
breakoutGame.gameLoop();