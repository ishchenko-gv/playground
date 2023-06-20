import Scene from "./scene";
import Ball from "./ball";
import Paddle from "./paddle";
import BrickField from "./brick-field";
import CanvasUtil from "./canvas-util";
import levels from "./levels";
import { LevelMap } from "./types";
import Player from "./player";

const canvas = document.getElementById("arkanoid") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;
const { width, height } = canvas;

class Game {
  player = new Player();
  level = 0;

  scene = this.createScene(
    levels[this.level] || levels[0],
    this.handleBrickDestroy.bind(this),
    this.handleLevelFinish
  );

  createScene(
    level: LevelMap,
    onBrickDestroy: (score: number) => void,
    onFinish: () => void
  ) {
    const canvasUtil = new CanvasUtil(ctx, width, height);
    const paddle = new Paddle(width);
    const ball = new Ball();
    const brickField = new BrickField(level);

    return new Scene(
      width,
      height,
      paddle,
      ball,
      brickField,
      canvasUtil,
      onBrickDestroy,
      onFinish
    );
  }

  handleBrickDestroy(score: number) {
    this.player.addScore(score);
  }

  handleLevelFinish() {
    this.level++;

    this.scene = this.createScene(
      levels[this.level] || levels[0],
      this.handleBrickDestroy.bind(this),
      this.handleLevelFinish
    );
  }
}

const game = new Game();

canvas.addEventListener("mousemove", (e) => {
  game.scene.movePaddle(e.movementX);
});

canvas.addEventListener("click", () => {
  canvas.requestPointerLock();

  game.scene.launchBall();
});

function draw() {
  game.scene.clear();
  game.scene.update();
  game.scene.draw();
  console.log("draw");
  requestAnimationFrame(draw);
}

draw();
