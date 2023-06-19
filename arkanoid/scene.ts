import Paddle from "./paddle";
import Ball from "./ball";

export default class Scene {
  constructor(width: number, height: number, paddle: Paddle, ball: Ball) {
    this.width = width;
    this.height = height;
    this.paddle = paddle;
    this.ball = ball;
  }

  width: number;
  height: number;
  paddle: Paddle;
  ball: Ball;

  isBallLost = false;

  update() {
    this.handleCollisions();
  }

  handleCollisions() {
    if (this.isBallLost) {
      return;
    }

    this.handleIfBallLost();
    this.handleBallWallCollision();
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