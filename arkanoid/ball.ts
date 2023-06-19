import MathUtil from "./math-util";
import CanvasUtil from "./canvas-util";

class Ball {
  constructor(paddlePosition: { x: number, y: number }, paddleSize: { width: number, height: number }) {
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

  updatePosition(paddleCenterX: number) {
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

  draw(canvasUtil: CanvasUtil) {
    canvasUtil.drawCircle([this.x, this.y], this.radius);
  }
}

namespace Ball {
  export enum Side {
    TOP, RIGHT, LEFT, BOTTOM
  }
}

export default Ball;