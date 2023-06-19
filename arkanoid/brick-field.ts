import Ball from "./ball";
import CanvasUtil from "./canvas-util";

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

export const level1Map = [
  [
    { offset: 0 },
    { color: "red" },
    { color: "green" },
    { color: "red" },
    { color: "green" },
    { color: "red" },
    { color: "green" },
    { color: "red" },
    { color: "green" },
  ],
];

type LevelMap = { offset?: number; color?: string }[][];

export default class BrickField {
  constructor(map: LevelMap) {
    for (let row of map) {
      let rowOpts = row.shift() || { offset: 0 };
      const startPointX = 50;
      const startPointY = 50;

      for (let i = 0; i < row.length; i++) {
        this.bricks.push(
          new Brick(
            rowOpts.offset || 0 + startPointX + Brick.Size.width * i,
            startPointY + Brick.Size.height,
            row[i].color || "black"
          )
        );
      }
    }
  }

  bricks: Brick[] = [];

  getBricks() {
    return this.bricks;
  }

  destroyBrick(brick: Brick) {
    this.bricks = this.bricks.filter((item) => item !== brick);
  }

  handleBallCollision(
    ballPosition: Ball.Position,
    ballDelta: Ball.Delta,
    onCollision: (side: Ball.Side) => void
  ) {
    for (let brick of this.getBricks()) {
      if (
        ballPosition.right >= brick.x &&
        ballPosition.left <= brick.x + Brick.Size.width &&
        ballPosition.bottom >= brick.y &&
        ballPosition.top <= brick.y + Brick.Size.height
      ) {
        if (ballPosition.right - ballDelta.dx <= brick.x) {
          onCollision(Ball.Side.RIGHT);
        }

        if (ballPosition.left - ballDelta.dx >= brick.x + Brick.Size.width) {
          onCollision(Ball.Side.LEFT);
        }

        if (ballPosition.bottom - ballDelta.dy <= brick.y) {
          onCollision(Ball.Side.BOTTOM);
        }

        if (ballPosition.top - ballDelta.dy >= brick.y + Brick.Size.height) {
          onCollision(Ball.Side.TOP);
        }

        this.destroyBrick(brick);
      }
    }
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
