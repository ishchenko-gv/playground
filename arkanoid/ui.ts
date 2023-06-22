export default class UI {
  constructor(
    document: Document,
    onCanvasClick: () => void,
    onCanvasMouseMove: (e: MouseEvent) => void,
    onGameRestart: () => void
  ) {
    this.document = document;
    this.rootElement = this.buildRootElement();
    this.rootElement.style.position = "relative";

    this.canvas = this.buildCanvasElement();
    this.canvas.addEventListener("click", onCanvasClick);
    this.canvas.addEventListener("mousemove", onCanvasMouseMove);

    this.scoreWrap = document.createElement("div");
    this.livesCountWrap = document.createElement("div");

    this.retryModal = this.buildRetryModal(onGameRestart);

    this.rootElement.appendChild(this.scoreWrap);
    this.rootElement.appendChild(this.livesCountWrap);
    this.rootElement.appendChild(this.canvas);
    this.rootElement.appendChild(this.retryModal);
  }

  private readonly document: Document;
  private readonly rootElement: HTMLDivElement;
  private readonly canvas: HTMLCanvasElement;
  private readonly scoreWrap: HTMLDivElement;
  private readonly livesCountWrap: HTMLDivElement;
  private readonly retryModal: HTMLDivElement;

  buildRootElement() {
    const rootElement = document.createElement("div");
    rootElement.style.width = "100vw";
    rootElement.style.height = "100vh";

    return rootElement;
  }

  buildCanvasElement() {
    const canvas = document.createElement("canvas");
    canvas.style.display = "block";
    canvas.style.border = "1px solid black";
    canvas.style.backgroundColor = "#b4b4b4";

    canvas.setAttribute("width", "500");
    canvas.setAttribute("height", "500");

    return canvas;
  }

  buildModal(contentElement: HTMLDivElement) {
    const modal = this.document.createElement("div");

    const style = {
      display: "none",
      position: "absolute",
      top: "0",
      left: "0",
      width: "100%",
      height: "100%",
    };

    modal.appendChild(contentElement);

    return this.addStyle<HTMLDivElement>(modal, style);
  }

  buildRetryModal(onRetry: () => void) {
    const wrapStyle = {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      height: "100%",
    };

    const wrap = this.addStyle<HTMLDivElement>(
      this.document.createElement("div"),
      wrapStyle
    );

    const retryBtn = this.buildButton({
      onClick: () => {
        this.hideRetryModal();
        this.requestPointerLock();
        onRetry();
      },
      text: "retry",
    });

    wrap.appendChild(retryBtn);

    return this.buildModal(wrap);
  }

  buildButton(
    {
      onClick,
      text,
      style,
    }: { onClick: () => void; text: string; style?: Record<string, string> } = {
      onClick: () => {},
      text: "",
      style: { backgroundColor: "gray", color: "black" },
    }
  ) {
    const resStyle = {
      margin: "0",
      padding: "12px",
      fontSize: "18px",
      appearance: "none",
      cursor: "pointer",
      ...style,
    };

    const button = this.addStyle(
      this.document.createElement("button"),
      resStyle
    );

    button.setAttribute("role", "button");
    button.addEventListener("click", onClick);
    button.innerHTML = text;

    return button;
  }

  showRetryModal() {
    this.exitPointerLock();
    this.retryModal.style.display = "block";
  }

  hideRetryModal() {
    this.retryModal.style.display = "none";
  }

  addStyle<T extends HTMLElement>(element: T, style: Record<string, string>) {
    Object.entries(style).forEach(([k, v]) => {
      (<any>element.style)[k] = v;
    });

    return element;
  }

  getRootElement() {
    return this.rootElement;
  }

  getCanvasCtx() {
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
}
