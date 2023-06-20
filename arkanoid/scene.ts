import Paddle from "./paddle";
import Ball from "./ball";
import BrickField from "./brick-field";
import CanvasUtil from "./canvas-util";

export default class Scene {
  constructor(
    width: number,
    height: number,
    paddle: Paddle,
    ball: Ball,
    brickField: BrickField,
    canvasUtil: CanvasUtil
  ) {
    this.width = width;
    this.height = height;
    this.paddle = paddle;
    this.ball = ball;
    this.brickField = brickField;
    this.canvasUtil = canvasUtil;
  }

  width: number;
  height: number;
  paddle: Paddle;
  ball: Ball;
  brickField: BrickField;
  canvasUtil: CanvasUtil;

  isBallLost = false;
  score = 0;

  update() {
    this.ball.updatePosition(this.paddle.getPosition().x);
    this.paddle.handleBallCollision(this.ball);
    this.brickField.handleBallCollision(this.ball, this.addScore.bind(this));
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

  addScore(score: number) {
    this.score += score;
    console.log(this.score);
  }

  clear() {
    this.canvasUtil.clear();
  }

  draw() {
    this.paddle.draw(this.canvasUtil);
    this.ball.draw(this.canvasUtil);
    this.brickField.draw(this.canvasUtil);
  }
}
