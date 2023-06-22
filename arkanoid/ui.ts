export default class UI {
  constructor(
    document: Document,
    onCanvasClick: () => void,
    onCanvasMouseMove: (e: MouseEvent) => void,
    onGameRestart: () => void
  ) {
    this.document = document;

    this.rootElement = document.createElement("div");
    this.rootElement.style.width = "100vw";
    this.rootElement.style.height = "100vh";

    this.canvas = document.createElement("canvas");
    this.canvas.style.border = "1px solid black";
    this.canvas.style.backgroundColor = "#b4b4b4";

    this.canvas.setAttribute("width", "500");
    this.canvas.setAttribute("height", "500");

    this.canvas.addEventListener("click", onCanvasClick);
    this.canvas.addEventListener("mousemove", onCanvasMouseMove);

    this.scoreWrap = document.createElement("div");
    this.livesCountWrap = document.createElement("div");

    this.restartBtn = document.createElement("button");

    this.restartBtn.addEventListener("click", () => {
      onGameRestart();
      this.hideRestartBtn();
    });

    this.restartBtn.innerHTML = "restart";
    this.restartBtn.style.display = "none";

    this.rootElement.appendChild(this.scoreWrap);
    this.rootElement.appendChild(this.livesCountWrap);
    this.rootElement.appendChild(this.restartBtn);
    this.rootElement.appendChild(this.canvas);
  }

  private readonly document: Document;
  private readonly rootElement: HTMLDivElement;
  private readonly canvas: HTMLCanvasElement;
  private readonly scoreWrap: HTMLDivElement;
  private readonly livesCountWrap: HTMLDivElement;
  private readonly restartBtn: HTMLButtonElement;

  getRootElement() {
    return this.rootElement;
  }

  getCanvasCtx(): CanvasRenderingContext2D {
    return this.canvas.getContext("2d")!;
  }

  requestPointerLock() {
    this.canvas.requestPointerLock();
  }

  exitPointerLock() {
    this.document.exitPointerLock();
  }

  getCanvasSize() {
    return {
      width: this.canvas.width,
      height: this.canvas.height,
    };
  }

  setScore(score: number) {
    this.scoreWrap.innerHTML = String(score);
  }

  setLivesCount(livesCount: number) {
    this.livesCountWrap.innerHTML = String(livesCount);
  }

  showRestartBtn() {
    this.restartBtn.style.display = "inline";
  }

  hideRestartBtn() {
    this.restartBtn.style.display = "none";
  }
}
