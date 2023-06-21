import Scene from "./scene";
import Ball from "./ball";
import Paddle from "./paddle";
import BrickField from "./brick-field";
import CanvasUtil from "./canvas-util";
import levels from "./levels";
import { LevelMap } from "./types";
import Player from "./player";

class UI extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: "open" });

    this.canvas = document.createElement("canvas");
    this.canvas.setAttribute("width", "500");
    this.canvas.setAttribute("height", "500");

    shadow.appendChild(this.canvas);

    const game = new Game(this.canvas);

    this.canvas.addEventListener("mousemove", (e) => {
      game.scene.movePaddle(e.movementX);
    });

    this.canvas.addEventListener("click", () => {
      this.canvas.requestPointerLock();

      game.scene.launchBall();
    });

    game.run();
  }

  canvas: HTMLCanvasElement;
}

class Game {
  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;

    this.scene = this.createScene(
      levels[this.level] || levels[0],
      this.handleBrickDestroy.bind(this),
      this.handleLevelFinish.bind(this)
    );
  }

  canvas: HTMLCanvasElement;

  run() {
    this.scene.clear();
    this.scene.update();
    this.scene.draw();

    requestAnimationFrame(this.run.bind(this));
  }

  player = new Player();
  level = 0;

  scene: Scene;

  createScene(
    level: LevelMap,
    onBrickDestroy: (score: number) => void,
    onFinish: () => void
  ) {
    const ctx = this.canvas.getContext("2d")!;
    const { width, height } = this.canvas;
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
      this.handleLevelFinish.bind(this)
    );
  }
}

customElements.define("arkanoid-game", UI);
