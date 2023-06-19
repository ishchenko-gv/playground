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
const brickField = new BrickField(level1Map);
const scene = new Scene(width, height, paddle, ball);
const canvasUtil = new CanvasUtil(ctx, width, height);

canvas.addEventListener("mousemove", (e) => {
  paddle.moveTo(e.offsetX);
});

canvas.addEventListener("click", () => {
  ball.launch();
});

function draw() {
  canvasUtil.clear();

  scene.update();

  ball.updatePosition(paddle.getPosition().x);

  paddle.handleBallCollision(ball.getPosition(), (side, angle) => ball.bounce(side, angle));
  brickField.handleBallCollision(ball.getPosition(), ball.getDelta(), (side) => ball.bounce(side));
  
  paddle.draw(canvasUtil);
  ball.draw(canvasUtil);
  brickField.draw(ctx);

  requestAnimationFrame(draw);
}

requestAnimationFrame(draw);
