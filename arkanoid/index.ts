import UI from "./ui";
import Game from "./game";

class ArkanoidElement extends HTMLElement {
  constructor() {
    super();

    const handleCanvasClick = () => {
      this.ui.requestPointerLock();
      this.game.scene.launchBall();
    };

    const handleCanvasMouseMove = (e: MouseEvent) => {
      this.game.scene.movePaddle(e.movementX);
    };

    const handleGameRestart = () => {
      this.game.stop();
      this.game = new Game(this.ui);
      this.game.render(requestAnimationFrame);
    };

    this.ui = new UI(
      document,
      handleCanvasClick,
      handleCanvasMouseMove,
      handleGameRestart
    );

    this.attachShadow({ mode: "open" }).appendChild(this.ui.getRootElement());

    this.game = new Game(this.ui);
    this.game.render(requestAnimationFrame);
  }

  private readonly ui: UI;
  private game: Game;
}

customElements.define("arkanoid-game", ArkanoidElement);
