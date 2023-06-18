const canvas = document.getElementById("arkanoid");
const ctx = canvas.getContext("2d");

class Scene {
  constructor(paddle, ball, bricksMap) {
    this.paddle = paddle;
    this.ball = ball;
    this.bricksMap = bricksMap;
  }

  isBallLost = false;

  update() {
    this.ball.updatePosition(this.paddle.getPosition().x);
    this.handleCollisions();
  }

  handleCollisions() {
    if (this.isBallLost) {
      return;
    }

    this.handleIfBallLost();
    this.handleBallWallCollision();
    this.handleBallPaddleCollision();
    this.handleBallBrickCollision();
  }

  handleBallWallCollision() {
    const ballPosition = this.ball.getPosition();

    if (ballPosition.right >= canvas.width) {
      this.ball.bounce(Ball.Side.RIGHT);
    }

    if (ballPosition.top <= 0) {
      this.ball.bounce(Ball.Side.TOP);
    }

    if (ballPosition.left <= 0) {
      this.ball.bounce(Ball.Side.LEFT);
    }
  }

  handleBallPaddleCollision() {
    const ballPosition = this.ball.getPosition();
    const paddlePosition = this.paddle.getPosition();

    if (
      ballPosition.bottom >= paddlePosition.y &&
      ballPosition.right >= paddlePosition.left &&
      ballPosition.left <= paddlePosition.right
    ) {
      const paddleCollisionPoint = ballPosition.x - paddlePosition.x;

      const bounceCorrection =
        ((100 / (this.paddle.getSize().width / 2)) * paddleCollisionPoint) /
        100;

      ball.bounce(Ball.Side.BOTTOM, bounceCorrection);
    }
  }

  handleBallBrickCollision() {
    const ballPosition = this.ball.getPosition();
    const ballDelta = this.ball.getDelta();

    for (let brick of this.bricksMap.getBricks()) {
      if (
        ballPosition.right >= brick.x &&
        ballPosition.left <= brick.x + Brick.Size.width &&
        ballPosition.bottom >= brick.y &&
        ballPosition.top <= brick.y + Brick.Size.height
      ) {
        if (ballPosition.right - ballDelta.dx <= brick.x) {
          this.ball.bounce(Ball.Side.RIGHT);
        }

        if (ballPosition.left - ballDelta.dx >= brick.x + Brick.Size.width) {
          this.ball.bounce(Ball.Side.LEFT);
        }

        if (ballPosition.bottom - ballDelta.dy <= brick.y) {
          this.ball.bounce(Ball.Side.BOTTOM);
        }

        if (ballPosition.top - ballDelta.dy >= brick.y + Brick.Size.height) {
          this.ball.bounce(Ball.Side.TOP);
        }

        this.bricksMap.removeBrick(brick);
      }
    }
  }

  handleIfBallLost() {
    const ballPosition = this.ball.getPosition();
    const paddlePosition = this.paddle.getPosition();

    if (
      (ballPosition.right < paddlePosition.left ||
        ballPosition.left > paddlePosition.right) &&
      ballPosition.bottom > paddlePosition.y
    ) {
      this.isBallLost = true;
    }
  }
}

class Paddle {
  width = 100;
  height = 6;
  x = canvas.width / 2;
  y = canvas.height - 30;

  moveTo(x) {
    if (x - this.width / 2 >= 0 && x + this.width / 2 <= canvas.width) {
      this.x = x;
    }
  }

  getPosition() {
    return {
      x: this.x,
      y: this.y,
      left: this.x - this.width / 2,
      right: this.x + this.width / 2,
    };
  }

  getSize() {
    return {
      width: this.width,
      height: this.height,
    };
  }

  draw(ctx) {
    const startPoint = [this.getPosition().left, this.getPosition().y];
    const endPoint = [this.getPosition().right, this.getPosition().y];

    drawLine(ctx, startPoint, endPoint, { width: this.height });
  }
}

class Ball {
  constructor(paddlePosition) {
    this.x = paddlePosition.x;
    this.y = paddlePosition.y - this.radius;
  }

  static Side = {
    TOP: "top",
    RIGHT: "right",
    BOTTOM: "bottom",
    LEFT: "left",
  };

  isLaunched = false;
  radius = 6;
  speed = 5;
  dx = Math.sqrt(this.speed ** 2 / 2);
  /**
   * even if the ball has not been launched, it's already has a collision with the paddle,
   * so this value should be changed to negative one, when tha game starts
   */
  dy = Math.sqrt(this.speed ** 2 / 2);

  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }

  getPosition() {
    return {
      x: this.x,
      y: this.y,
      top: this.y - this.radius,
      right: this.x + this.radius,
      bottom: this.y + this.radius,
      left: this.x - this.radius,
    };
  }

  getDelta() {
    return {
      dx: this.dx,
      dy: this.dy,
    };
  }

  bounce(side, bounceCorrection) {
    if ([Ball.Side.LEFT, Ball.Side.RIGHT].includes(side)) {
      this.dx = -this.dx;
    }

    if ([Ball.Side.TOP, Ball.Side.BOTTOM].includes(side)) {
      if (bounceCorrection) {
        const angleDegrees =
          90 * (1 - Math.min(Math.abs(bounceCorrection), 0.8));

        const angleRadians = (angleDegrees * Math.PI) / 180;
        const dx = Math.cos(angleRadians) * this.speed;
        const dy = Math.sin(angleRadians) * this.speed;
        const sign = bounceCorrection > 0 ? 1 : -1;

        this.dx = dx * sign;
        this.dy = -dy;

        this.speed += 0.3;
      } else {
        this.dy = -this.dy;
      }
    }
  }

  launch() {
    this.isLaunched = true;
  }

  updatePosition(paddleCenterX) {
    if (this.isLaunched) {
      this.x = this.x + this.dx;
      this.y = this.y + this.dy;
    } else {
      this.x = paddleCenterX;
    }
  }

  draw(ctx) {
    drawCircle(ctx, [this.x, this.y], this.radius);
  }
}

class Brick {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
  }

  static Size = {
    width: 50,
    height: 20,
  };
}

const level1Map = [
  [
    { offset: 0 },
    { color: "red" },
    { color: "green" },
    { color: "red" },
    { color: "green" },
    { color: "red" },
  ],
];

class BricksMap {
  constructor(map) {
    this.bricks = [];

    for (let row of map) {
      let rowOpts = row.shift();
      const startPointX = 50;
      const startPointY = 50;

      for (let i = 0; i < row.length; i++) {
        this.bricks.push(
          new Brick(
            rowOpts.offset + startPointX + Brick.Size.width * i,
            startPointY + Brick.Size.height,
            row[i].color
          )
        );
      }
    }
  }

  getBricks() {
    return this.bricks;
  }

  removeBrick(brick) {
    this.bricks = this.bricks.filter((item) => item !== brick);
  }

  draw(ctx) {
    for (let brick of this.bricks) {
      ctx.beginPath();
      ctx.fillStyle = brick.color;
      ctx.rect(brick.x, brick.y, Brick.Size.width, Brick.Size.height);
      ctx.fill();
      ctx.stroke();
    }
  }
}

const paddle = new Paddle();
const ball = new Ball(paddle.getPosition());
const bricksMap = new BricksMap(level1Map);
const scene = new Scene(paddle, ball, bricksMap);

canvas.addEventListener("mousemove", (e) => {
  paddle.moveTo(e.offsetX);
});

canvas.addEventListener("click", () => {
  ball.launch();
});

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  scene.update();
  paddle.draw(ctx);
  ball.draw(ctx);
  bricksMap.draw(ctx);

  requestAnimationFrame(draw);
}

requestAnimationFrame(draw);

function drawLine(
  ctx,
  startPoint,
  endPoint,
  opts = { width: 2, color: "white" }
) {
  ctx.beginPath();
  ctx.moveTo(...startPoint);
  ctx.lineTo(...endPoint);
  ctx.closePath();
  ctx.lineWidth = opts.width;
  ctx.strokeStyle = opts.color;
  ctx.stroke();
  ctx.lineWidth = 1;
}

function drawCircle(ctx, centerPoint, radius) {
  ctx.beginPath();
  ctx.arc(centerPoint[0], centerPoint[1], radius, 0, 2 * Math.PI);
  ctx.fillStyle = "black";
  ctx.fill();
}
