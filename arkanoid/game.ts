import Scene from "./scene";
import Ball from "./ball";
import Paddle from "./paddle";
import BrickField from "./brick-field";
import CanvasUtil from "./canvas-util";
import levels, { LevelMap } from "./levels";
import Player from "./player";
import UI from "./ui";

export default class Game {
  constructor(ui: UI) {
    this.ui = ui;
    this.ui.setScore(this.player.getScore());
    this.ui.setLivesCount(this.player.getLives());

    this.scene = this.createScene(levels[this.level]);
  }

  private readonly ui: UI;

  private readonly FPS = 60;
  private lastRenderTime = Date.now();

  scene: Scene;

  private player = new Player();
  private level = 0;
  private isStopped = false;

  render(raf: (f: () => void) => number) {
    if (this.isStopped) {
      return;
    }

    if (this.shouldRender()) {
      this.scene.clear();
      this.scene.update();
      this.scene.draw();
    }

    raf(this.render.bind(this, raf));
  }

  shouldRender() {
    if (Date.now() - this.lastRenderTime > 1000 / this.FPS) {
      this.lastRenderTime = Date.now();
      return true;
    }

    return false;
  }

  stop() {
    this.isStopped = true;
  }

  createScene(level: LevelMap) {
    const ctx = this.ui.getCanvasCtx();
    const { width, height } = this.ui.getCanvasSize();
    const canvasUtil = new CanvasUtil(ctx, width, height);
    const paddle = new Paddle(width);
    const ball = new Ball();
    const brickField = new BrickField(level);

    const handleBrickDestroy = (score: number) => {
      this.player.addScore(score);
      this.ui.setScore(this.player.getScore());
    };

    const handleLevelFinish = () => {
      if (this.level === levels.length - 1) {
        this.stop();
        return this.ui.showRetryModal();
      }

      this.level++;

      this.scene = this.createScene(levels[this.level]);
    };

    const handleBallLoss = () => {
      this.player.decreaseLives();
      this.ui.setLivesCount(this.player.getLives());

      if (!this.player.getLives()) {
        this.stop();
        this.ui.showRetryModal();
      }
    };

    return new Scene(
      width,
      height,
      paddle,
      ball,
      brickField,
      canvasUtil,
      handleBrickDestroy,
      handleLevelFinish,
      handleBallLoss
    );
  }
}
