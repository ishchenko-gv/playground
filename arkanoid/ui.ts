export default class UI {
  constructor(document: Document, onGameRestart: () => void) {
    this.rootElement = document.createElement("div");
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
  }

  rootElement: HTMLDivElement;
  scoreWrap: HTMLDivElement;
  livesCountWrap: HTMLDivElement;
  restartBtn: HTMLButtonElement;

  getRootElement() {
    return this.rootElement;
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
