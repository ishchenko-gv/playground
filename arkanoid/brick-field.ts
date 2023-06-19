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

type LevelMap = { offset?: number, color?: string}[][];

export default class BricksMap {
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
            row[i].color || 'black'
          )
        );
      }
    }
  }

  bricks: Brick[] = [];

  getBricks() {
    return this.bricks;
  }

  removeBrick(brick: Brick) {
    this.bricks = this.bricks.filter((item) => item !== brick);
  }

  draw(ctx: CanvasRenderingContext2D) {
    for (let brick of this.bricks) {
      ctx.beginPath();
      ctx.fillStyle = brick.color;
      ctx.rect(brick.x, brick.y, Brick.Size.width, Brick.Size.height);
      ctx.fill();
      ctx.stroke();
    }
  }
}