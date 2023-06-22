import Ball from "./ball";
import CanvasUtil from "./canvas-util";
import { Point } from "./types";

export default class Paddle {
  constructor(sceneWidth: number) {
    this.sceneWidth = sceneWidth;
  }

  private x = 0;
  private y = 0;
  private width = 100;
  private height = 6;
  private readonly sceneWidth: number;
  private heldBall: Ball | null = null;

  moveTo(x: number, y?: number) {
    if (x - this.width / 2 >= 0 && x + this.width / 2 <= this.sceneWidth) {
      this.x = x;
    }

    if (y) {
      this.y = y;
    }
  }

  move(dx: number) {
    const x = this.x + dx;

    if (x - this.width / 2 >= 0 && x + this.width / 2 <= this.sceneWidth) {
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

  holdBall(ball: Ball) {
    ball.hold();
    this.heldBall = ball;
  }

  launchBall() {
    this.heldBall?.launch();
    this.heldBall = null;
  }

  handleBallCollision(ball: Ball) {
    const paddlePosition = this.getPosition();
    const paddleSize = this.getSize();
    const ballPosition = ball.getPosition();
    const ballDelta = ball.getDelta();

    if (
      ballPosition.bottom >= paddlePosition.y - paddleSize.height &&
      ballPosition.right >= paddlePosition.left &&
      ballPosition.left <= paddlePosition.right &&
      ballPosition.bottom - ballDelta.dy < paddlePosition.y - paddleSize.height
    ) {
      const paddleCollisionPoint = ballPosition.x - paddlePosition.x;

      const bounceCorrection =
        ((100 / (this.getSize().width / 2)) * paddleCollisionPoint) / 100;

      const angle = 90 * Math.min(Math.abs(bounceCorrection), 0.8);
      const sign = bounceCorrection > 0 ? 1 : -1;

      ball.bounce(Ball.Side.BOTTOM, angle * sign);
    }
  }

  draw(canvasUtil: CanvasUtil) {
    const startPoint = [this.getPosition().left, this.getPosition().y] as Point;
    const endPoint = [this.getPosition().right, this.getPosition().y] as Point;

    canvasUtil.drawLine(startPoint, endPoint, { width: this.height });
  }
}
