import Ball from "./ball";
import CanvasUtil from "./canvas-util";
import { Point } from "./types";

export default class Paddle {
  constructor(sceneWidth: number, sceneHeight: number) {
    this.sceneWidth = sceneWidth;
    this.sceneHeight = sceneHeight;
    this.x = this.sceneWidth / 2;
    this.y = this.sceneHeight - 30;
  }

  x: number;
  y: number;
  width = 100;
  height = 6;
  sceneWidth: number;
  sceneHeight: number;

  moveTo(x: number) {
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

  handleBallCollision(
    ballPosition: Ball.Position,
    onCollision: (side: Ball.Side, angle: number) => void
  ) {
    const paddlePosition = this.getPosition();

    if (
      ballPosition.bottom >= paddlePosition.y &&
      ballPosition.right >= paddlePosition.left &&
      ballPosition.left <= paddlePosition.right
    ) {
      const paddleCollisionPoint = ballPosition.x - paddlePosition.x;

      const bounceCorrection =
        ((100 / (this.getSize().width / 2)) * paddleCollisionPoint) / 100;

      const angle = 90 * Math.min(Math.abs(bounceCorrection), 0.8);
      const sign = bounceCorrection > 0 ? 1 : -1;

      onCollision(Ball.Side.BOTTOM, angle * sign);
    }
  }

  draw(canvasUtil: CanvasUtil) {
    const startPoint = [this.getPosition().left, this.getPosition().y] as Point;
    const endPoint = [this.getPosition().right, this.getPosition().y] as Point;

    canvasUtil.drawLine(startPoint, endPoint, { width: this.height });
  }
}
