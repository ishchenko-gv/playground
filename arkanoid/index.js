const canvas = document.getElementById("arkanoid");
const ctx = canvas.getContext("2d");

class Scene {
  constructor(paddle, ball) {
    this.paddle = paddle;
    this.ball = ball;
  }
}

class Paddle {
  width = 100;
  height = 1;
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

    drawLine(ctx, startPoint, endPoint, { width: this.getSize().height });
  }
}

class Ball {
  constructor(paddle) {
    this.paddle = paddle;
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
  radius = 5;
  speed = 3;
  x = 0;
  y = 0;
  dx = this.speed;
  /**
   * even if the ball has not been launched, it's already has a collision with the platform,
   * so this value should be changed to negative one, when tha game starts
   */
  dy = this.speed;

  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }

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

  checkCollision() {
    const wallCollision = this.checkWallCollision();
    const paddleCollision = this.checkPaddleCollision();

    return wallCollision || paddleCollision;
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
      console.log("is lost");
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

const paddle = new Paddle();
const ball = new Ball(paddle);

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
  ctx.arc(centerPoint[0], centerPoint[1], radius, 0, 2 * Math.PI);
  ctx.fill();
}
