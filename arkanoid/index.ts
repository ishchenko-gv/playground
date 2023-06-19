const canvas = document.getElementById("arkanoid") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;

class Scene {
  constructor(paddle: Paddle, ball: Ball, bricksMap: BricksMap) {
    this.paddle = paddle;
    this.ball = ball;
    this.bricksMap = bricksMap;
  }

  paddle: Paddle;
  ball: Ball;
  bricksMap: BricksMap;

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

      const angle = 90 * Math.min(Math.abs(bounceCorrection), 0.8);
      const sign = bounceCorrection > 0 ? 1 : -1;

      ball.bounce(Ball.Side.BOTTOM, angle * sign);
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

  moveTo(x: number) {
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

  draw(ctx: CanvasRenderingContext2D) {
    const startPoint = [this.getPosition().left, this.getPosition().y];
    const endPoint = [this.getPosition().right, this.getPosition().y];

    drawLine(ctx, startPoint, endPoint, { width: this.height });
  }
}

class Ball {
  constructor(paddlePosition, paddleSize) {
    this.x = paddlePosition.x;
    this.y = paddlePosition.y - this.radius - paddleSize.height;
  }

  x: number;
  y: number;
  isLaunched = false;
  radius = 6;
  minSpeed = 5;
  speed = this.minSpeed;
  maxSpeed = 9;
  paddleBounceAcceleration = 0.3;
  paddleBounceAngle = 10;
  dx = MathUtil.getDeltaByAngle(this.paddleBounceAngle, this.speed).dx;
  dy = -MathUtil.getDeltaByAngle(this.paddleBounceAngle, this.speed).dy;

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

  updatePosition(paddleCenterX) {
    if (this.isLaunched) {
      this.x = this.x + this.dx;
      this.y = this.y + this.dy;
    } else {
      this.x = paddleCenterX;
    }
  }

  getDelta() {
    return {
      dx: this.dx,
      dy: this.dy,
    };
  }

  increaseSpeed() {
    if (this.speed < this.maxSpeed) {
      this.speed += 0.3;
    }
  }

  decreaseSpeed() {
    if (this.speed > this.minSpeed) {
      this.speed -= 0.3;
    }
  }

  bounce(side: Ball.Side, angle?: number) {
    if ([Ball.Side.LEFT, Ball.Side.RIGHT].includes(side)) {
      this.dx = -this.dx;
    }

    if ([Ball.Side.TOP, Ball.Side.BOTTOM].includes(side)) {
      if (angle) {
        const { dx, dy } = MathUtil.getDeltaByAngle(angle, this.speed);

        this.dx = dx;
        this.dy = -Math.abs(dy);

        if (Math.abs(angle) > 25) {
          this.increaseSpeed();
        } else {
          this.decreaseSpeed();
        }
      } else {
        this.dy = -this.dy;
      }
    }
  }

  launch() {
    this.isLaunched = true;
  }

  draw(ctx) {
    drawCircle(ctx, [this.x, this.y], this.radius);
  }
}

namespace Ball {
  export enum Side {
    TOP, RIGHT, LEFT, BOTTOM
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

  color: string;
  x: number;
  y: number;
}

const level1Map = [
  [
    { offset: 0 },
    { color: "red" },
    { color: "green" },
    { color: "red" },
    { color: "green" },
    { color: "red" },
    { color: "green" },
    { color: "red" },
    { color: "green" },
  ],
];

class BricksMap {
  constructor(map) {
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

  bricks: Brick[] = [];

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

class MathUtil {
  static getDeltaByAngle(angle, speed) {
    return {
      dx: Math.sin((Math.PI * angle) / 180) * speed,
      dy: Math.cos((Math.PI * angle) / 180) * speed,
    };
  }
}

const paddle = new Paddle();
const ball = new Ball(paddle.getPosition(), paddle.getSize());
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
  opts: { width?: number, color?: string } = { width: 2, color: "white" }
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
