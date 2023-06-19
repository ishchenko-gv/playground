import { Point } from "./types";

export default class CanvasUtil {
  constructor(ctx: CanvasRenderingContext2D, width: number, height: number) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
  }

  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;

  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  drawLine(
    startPoint: Point,
    endPoint: Point,
    opts: { width?: number, color?: string } = { width: 2, color: "white" }
  ) {
    this.ctx.beginPath();
    this.ctx.moveTo(...startPoint);
    this.ctx.lineTo(...endPoint);
    this.ctx.closePath();
    this.ctx.lineWidth = opts.width || 1;
    this.ctx.strokeStyle = opts.color || 'black';
    this.ctx.stroke();
    this.ctx.lineWidth = 1;
  }

  drawCircle(centerPoint: Point, radius: number) {
    this.ctx.beginPath();
    this.ctx.arc(centerPoint[0], centerPoint[1], radius, 0, 2 * Math.PI);
    this.ctx.fillStyle = "black";
    this.ctx.fill();
  }
}