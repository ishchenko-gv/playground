import MathUtil from "./math-util";
import CanvasUtil from "./canvas-util";

class Ball {
  private x = 0;
  private y = 0;
  private isLaunched = false;
  private radius = 6;
  private readonly minSpeed = 12;
  private readonly maxSpeed = 20;
  private speed = this.minSpeed;
  private readonly paddleBounceAcceleration = 0.3;
  private dx = MathUtil.getDeltaByAngle(10, this.speed).dx;
  private dy = -MathUtil.getDeltaByAngle(10, this.speed).dy;

  setPosition(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  getPosition(): Ball.Position {
    return {
      x: this.x,
      y: this.y,
      top: this.y - this.radius,
      right: this.x + this.radius,
      bottom: this.y + this.radius,
      left: this.x - this.radius,
    };
  }

  getRadius() {
    return this.radius;
  }

  updatePosition(paddleCenterX: number) {
    if (this.isLaunched) {
      this.x = this.x + this.dx;
      this.y = this.y + this.dy;
    } else {
      this.x = paddleCenterX;
    }
  }

  getDelta(): Ball.Delta {
    return {
      dx: this.dx,
      dy: this.dy,
    };
  }

  increaseSpeed() {
    if (this.speed < this.maxSpeed) {
      this.speed += this.paddleBounceAcceleration;
    }
  }

  decreaseSpeed() {
    if (this.speed > this.minSpeed) {
      this.speed -= this.paddleBounceAcceleration;
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

  hold() {
    this.isLaunched = false;
  }

  draw(canvasUtil: CanvasUtil) {
    canvasUtil.drawCircle([this.x, this.y], this.radius);
  }
}

namespace Ball {
  export enum Side {
    TOP,
    RIGHT,
    LEFT,
    BOTTOM,
  }

  export type Position = {
    x: number;
    y: number;
    top: number;
    right: number;
    bottom: number;
    left: number;
  };

  export type Delta = {
    dx: number;
    dy: number;
  };
}

export default Ball;
