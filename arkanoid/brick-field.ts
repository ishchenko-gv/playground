import Ball from "./ball";
import CanvasUtil from "./canvas-util";
import { LevelMap } from "./levels";
export class Brick {
  constructor(x: number, y: number, color: string) {
    this.x = x;
    this.y = y;
    this.color = color;
  }

  static Size = {
    width: 50,
    height: 20,
  };

  color: string;
  x: number;
  y: number;
}
export default class BrickField {
  private bricks: Brick[] = [];

  constructor(map: LevelMap) {
    for (let i = 0; i < map.length; i++) {
      let rowOpts = map[i][0] || { offset: 0 };
      const startPointX = 50;
      const startPointY = 50;

      for (let j = 1; j < map[i].length; j++) {
        this.bricks.push(
          new Brick(
            rowOpts.offset || 0 + startPointX + Brick.Size.width * (j - 1),
            startPointY + Brick.Size.height * i,
            map[i][j].color || "black"
          )
        );
      }
    }
  }

  private getBricks() {
    return this.bricks;
  }

  private destroyBrick(brick: Brick) {
    this.bricks = this.bricks.filter((item) => item !== brick);
  }

  handleBallCollision(ball: Ball, onDestroy: (score: number) => void) {
    const ballPosition = ball.getPosition();
    const ballDelta = ball.getDelta();

    for (let brick of this.getBricks()) {
      if (
        ballPosition.right >= brick.x &&
        ballPosition.left <= brick.x + Brick.Size.width &&
        ballPosition.bottom >= brick.y &&
        ballPosition.top <= brick.y + Brick.Size.height
      ) {
        if (ballPosition.right - ballDelta.dx <= brick.x) {
          ball.bounce(Ball.Side.RIGHT);
        }

        if (ballPosition.left - ballDelta.dx >= brick.x + Brick.Size.width) {
          ball.bounce(Ball.Side.LEFT);
        }

        if (ballPosition.bottom - ballDelta.dy <= brick.y) {
          ball.bounce(Ball.Side.BOTTOM);
        }

        if (ballPosition.top - ballDelta.dy >= brick.y + Brick.Size.height) {
          ball.bounce(Ball.Side.TOP);
        }

        this.destroyBrick(brick);

        onDestroy(100);

        break;
      }
    }
  }

  isEmpty() {
    return !this.bricks.length;
  }

  draw(canvasUtil: CanvasUtil) {
    for (let brick of this.bricks) {
      canvasUtil.drawRectangle(
        brick.x,
        brick.y,
        Brick.Size.width,
        Brick.Size.height,
        { color: brick.color }
      );
    }
  }
}
