import UI from "./ui";
import Game from "./game";

class ArkanoidElement extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: "open" });
    this.ui = new UI(document, this.restartGame.bind(this));
    this.canvas = document.createElement("canvas");
    this.canvas.style.border = "1px solid black";

    this.canvas.setAttribute("width", "500");
    this.canvas.setAttribute("height", "500");

    shadow.appendChild(this.ui.getRootElement());
    shadow.appendChild(this.canvas);

    this.game = new Game(this.canvas, this.ui);

    this.canvas.addEventListener("mousemove", (e) => {
      this.game.scene.movePaddle(e.movementX);
    });

    this.canvas.addEventListener("click", () => {
      this.canvas.requestPointerLock();

      this.game.scene.launchBall();
    });

    this.game.run(requestAnimationFrame);
  }

  restartGame() {
    this.game.stop();
    this.game = new Game(this.canvas, this.ui);
    this.game.run(requestAnimationFrame);
  }

  ui: UI;
  canvas: HTMLCanvasElement;
  game: Game;
}

customElements.define("arkanoid-game", ArkanoidElement);
