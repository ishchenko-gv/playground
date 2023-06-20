import Scene from "./scene";
import Ball from "./ball";
import Paddle from "./paddle";
import BrickField, { level1Map } from "./brick-field";
import CanvasUtil from "./canvas-util";

const canvas = document.getElementById("arkanoid") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;
const { width, height } = canvas;

const canvasUtil = new CanvasUtil(ctx, width, height);
const paddle = new Paddle(width, height);
const ball = new Ball(paddle.getPosition(), paddle.getSize());
const brickField = new BrickField(level1Map);
const scene = new Scene(width, height, paddle, ball, brickField, canvasUtil);

canvas.addEventListener("mousemove", (e) => {
  paddle.move(e.movementX);
});

canvas.addEventListener("click", () => {
  canvas.requestPointerLock();
  ball.launch();
});

function draw() {
  scene.clear();
  scene.update();
  scene.draw();

  requestAnimationFrame(draw);
}

draw();
