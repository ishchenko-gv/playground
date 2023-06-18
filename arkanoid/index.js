const canvas = document.getElementById("arkanoid");
const ctx = canvas.getContext("2d");

class Scene {
  constructor(paddle, ball, bricksMap) {}
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
    };
  }

  getSize() {
    return {
      width: this.width,
      height: this.height,
    };
  }

  draw(ctx) {
    const startPoint = [this.x - this.width / 2, canvas.height - 30];
    const endPoint = [this.x + this.width / 2, canvas.height - 30];

    drawLine(ctx, startPoint, endPoint, { width: this.height });
  }
}

class Ball {
  constructor(paddle, bricksMap) {
    this.paddle = paddle;
    this.bricksMap = bricksMap;
    this.x = this.paddle.getPosition().x;
    this.y =
      this.paddle.getPosition().y - this.paddle.getSize().height - this.radius;
  }

  static Side = {
    TOP: "top",
    RIGHT: "right",
    BOTTOM: "bottom",
    LEFT: "left",
  };

  isLaunched = false;
  isLost = false;
  radius = 6;
  speed = 3;
  x = 0;
  y = 0;
  dx = this.speed;
  /**
   * even if the ball has not been launched, it's already has a collision with the paddle,
   * so this value should be changed to negative one, when tha game starts
   */
  dy = this.speed;

  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }

  bounce(side) {}

  launch() {
    this.isLaunched = true;
  }

  checkWallCollision() {
    if (this.x + this.radius >= canvas.width) {
      return Ball.Side.RIGHT;
    }

    if (this.y - this.radius <= 0) {
      return Ball.Side.TOP;
    }

    if (this.x - this.radius <= 0) {
      return Ball.Side.LEFT;
    }

    return null;
  }

  checkPaddleCollision() {
    if (
      this.y + this.radius >=
        this.paddle.getPosition().y - this.paddle.getSize().height &&
      this.x + this.radius >=
        this.paddle.getPosition().x - this.paddle.getSize().width / 2 &&
      this.x - this.radius <=
        this.paddle.getPosition().x + this.paddle.getSize().width / 2
    ) {
      return Ball.Side.BOTTOM;
    }
  }

  checkBrickCollision() {
    for (let brick of this.bricksMap.getBricks()) {
      if (
        this.x + this.radius >= brick.x &&
        this.x - this.radius <= brick.x + Brick.Size.width &&
        this.y + this.radius >= brick.y &&
        this.y - this.radius <= brick.y + Brick.Size.height
      ) {
        if (this.x + this.radius - this.dx <= brick.x) {
          return [Ball.Side.RIGHT, brick];
        }

        if (this.x - this.radius - this.dx >= brick.x + Brick.Size.width) {
          return [Ball.Side.LEFT, brick];
        }

        if (this.y + this.radius - this.dy <= brick.y) {
          return [Ball.Side.BOTTOM, brick];
        }

        if (this.y - this.radius - this.dy >= brick.y + Brick.Size.height) {
          return [Ball.Side.TOP, brick];
        }
      }
    }
  }

  checkCollision() {
    const wallCollision = this.checkWallCollision();
    const paddleCollision = this.checkPaddleCollision();
    const brickCollision = this.checkBrickCollision();

    if (brickCollision?.[1]) this.bricksMap.removeBrick(brickCollision[1]);

    return wallCollision || paddleCollision || brickCollision?.[0];
  }

  checkIfLost() {
    if (
      (this.x + this.radius <
        this.paddle.getPosition().x - this.paddle.getSize().width / 2 ||
        this.x - this.radius >
          this.paddle.getPosition().x + this.paddle.getSize().width / 2) &&
      this.y + this.radius >
        this.paddle.getPosition().y - this.paddle.getSize().height
    ) {
      return true;
    }

    return false;
  }

  draw(ctx) {
    if (this.isLaunched) {
      if (!this.isLost && this.checkIfLost()) {
        this.isLost = true;
      }

      if (!this.isLost) {
        const collisionSide = this.checkCollision();

        if ([Ball.Side.TOP, Ball.Side.BOTTOM].includes(collisionSide)) {
          this.dy = -this.dy;
        }

        if ([Ball.Side.LEFT, Ball.Side.RIGHT].includes(collisionSide)) {
          this.dx = -this.dx;
        }
      }

      this.x = this.x + this.dx;
      this.y = this.y + this.dy;
    } else {
      this.x = this.paddle.getPosition().x;
    }

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
const bricksMap = new BricksMap(level1Map);
const ball = new Ball(paddle, bricksMap);

canvas.addEventListener("mousemove", (e) => {
  paddle.moveTo(e.offsetX);
});

canvas.addEventListener("click", () => {
  ball.launch();
});

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
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
