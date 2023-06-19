import Scene from './scene';
import Ball from './ball';
import Paddle from './paddle';
import BrickField, { level1Map } from './brick-field';
import CanvasUtil from './canvas-util';

const canvas = document.getElementById("arkanoid") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;
const { width, height } = canvas;

const paddle = new Paddle(width, height);
const ball = new Ball(paddle.getPosition(), paddle.getSize());
const bricksMap = new BrickField(level1Map);
const scene = new Scene(width, height, paddle, ball, bricksMap);
const canvasUtil = new CanvasUtil(ctx);

canvas.addEventListener("mousemove", (e) => {
  paddle.moveTo(e.offsetX);
});

canvas.addEventListener("click", () => {
  ball.launch();
});

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  scene.update();
  paddle.draw(canvasUtil);
  ball.draw(canvasUtil);
  bricksMap.draw(ctx);

  requestAnimationFrame(draw);
}

requestAnimationFrame(draw);
