import Paddle from "./paddle";
import Ball from "./ball";
import BricksMap, { Brick } from "./brick-field";

export default class Scene {
  constructor(width: number, height: number, paddle: Paddle, ball: Ball, bricksMap: BricksMap) {
    this.width = width;
    this.height = height;
    this.paddle = paddle;
    this.ball = ball;
    this.bricksMap = bricksMap;
  }

  width: number;
  height: number;
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

    if (ballPosition.right >= this.width) {
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

      this.ball.bounce(Ball.Side.BOTTOM, angle * sign);
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