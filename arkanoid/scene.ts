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
    canvasUtil: CanvasUtil,
    onBrickDestroy: (score: number) => void,
    onFinish: () => void,
    onBallLoss: () => void
  ) {
    this.width = width;
    this.height = height;
    this.paddle = paddle;
    this.ball = ball;
    this.brickField = brickField;
    this.canvasUtil = canvasUtil;
    this.handleBrickDestroy = onBrickDestroy;
    this.handleLevelFinish = onFinish;
    this.handleBallLoss = onBallLoss;

    this.paddle.moveTo(this.width / 2, this.height - 30);

    this.putBallOnPaddle();
  }

  private readonly width: number;
  private readonly height: number;
  private readonly paddle: Paddle;
  private readonly ball: Ball;
  private readonly brickField: BrickField;
  private readonly canvasUtil: CanvasUtil;
  private readonly handleBrickDestroy = (score: number) => {};
  private readonly handleLevelFinish = () => {};
  private readonly handleBallLoss = () => {};

  update() {
    if (this.brickField.isEmpty()) {
      this.handleLevelFinish();
    }

    this.ball.updatePosition(this.paddle.getPosition().x);
    this.paddle.handleBallCollision(this.ball);
    this.brickField.handleBallCollision(this.ball, this.handleBrickDestroy);
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

    if (ballPosition.top > this.height) {
      this.handleBallLoss();
      this.putBallOnPaddle();
    }
  }

  putBallOnPaddle() {
    this.ball.setPosition(
      this.paddle.getPosition().x,
      this.height - 30 - this.ball.getRadius() - this.paddle.getSize().height
    );

    this.paddle.holdBall(this.ball);
  }

  movePaddle(dx: number) {
    this.paddle.move(dx);
  }

  launchBall() {
    this.paddle.launchBall();
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
