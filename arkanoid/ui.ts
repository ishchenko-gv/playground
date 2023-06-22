export default class UI {
  constructor(
    document: Document,
    onCanvasClick: () => void,
    onCanvasMouseMove: (e: MouseEvent) => void,
    onGameRestart: () => void
  ) {
    this.document = document;

    this.canvas = this.createCanvasElement();
    this.canvas.addEventListener("click", onCanvasClick);
    this.canvas.addEventListener("mousemove", onCanvasMouseMove);

    this.scoreWrap = document.createElement("div");
    this.livesCountWrap = document.createElement("div");

    this.retryModal = this.createRetryModal(onGameRestart);

    this.rootElement = this.createRootElement([
      this.scoreWrap,
      this.livesCountWrap,
      this.canvas,
      this.retryModal,
    ]);
  }

  private readonly document: Document;
  private readonly rootElement: HTMLDivElement;
  private readonly canvas: HTMLCanvasElement;
  private readonly scoreWrap: HTMLDivElement;
  private readonly livesCountWrap: HTMLDivElement;
  private readonly retryModal: HTMLDivElement;

  createElement<T extends HTMLElement>(
    tag: string,
    {
      children,
      styles,
      attributes,
      onClick,
    }: {
      children?: (HTMLElement | string)[];
      styles?: Record<string, string>;
      attributes?: Record<string, string>;
      onClick?: () => void;
    }
  ) {
    const element = this.document.createElement(tag) as T;

    if (children) {
      children.forEach((child) => {
        if (typeof child === "string") {
          return element.appendChild(this.document.createTextNode(child));
        }

        element.appendChild(child);
      });
    }

    if (styles) this.addStyles(element, styles);
    if (attributes) this.addAttributes(element, attributes);
    if (onClick) element.addEventListener("click", onClick);

    return element;
  }

  createRootElement(children: HTMLElement[]) {
    return this.createElement<HTMLDivElement>("div", {
      children,
      styles: {
        position: "relative",
        width: "100vw",
        height: "100vh",
      },
    });
  }

  createCanvasElement() {
    return this.createElement<HTMLCanvasElement>("canvas", {
      styles: {
        display: "block",
        margin: "32px auto",
        border: "1px solid gray",
        backgroundColor: "#b4b4b4",
      },
      attributes: {
        width: "500",
        height: "500",
      },
    });
  }

  createModal<T extends HTMLElement>(contentElement: T) {
    return this.createElement<HTMLDivElement>("div", {
      children: [contentElement],
      styles: {
        display: "none",
        position: "absolute",
        top: "0",
        left: "0",
        width: "100%",
        height: "100%",
      },
    });
  }

  createRetryModal(onRetry: () => void) {
    const wrap = this.createElement("div", {
      children: [
        this.createButton({
          onClick: () => {
            this.hideRetryModal();
            this.requestPointerLock();
            onRetry();
          },
          text: "retry",
        }),
      ],
      styles: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
      },
    });

    return this.createModal(wrap);
  }

  createButton(
    {
      text,
      styles,
      onClick,
    }: {
      text: string;
      styles?: Record<string, string>;
      onClick: () => void;
    } = {
      text: "",
      styles: { backgroundColor: "gray", color: "black" },
      onClick: () => {},
    }
  ) {
    return this.createElement("button", {
      children: [text],
      styles: {
        margin: "0",
        padding: "12px 32px",
        fontSize: "18px",
        appearance: "none",
        cursor: "pointer",
        border: "none",
        borderRadius: "8px",
        ...styles,
      },
      attributes: {
        role: "button",
      },
      onClick,
    });
  }

  showRetryModal() {
    this.exitPointerLock();
    this.retryModal.style.display = "block";
  }

  hideRetryModal() {
    this.retryModal.style.display = "none";
  }

  addStyles<T extends HTMLElement>(element: T, styles: Record<string, string>) {
    Object.entries(styles).forEach(([k, v]) => {
      (<Record<string, string>>(<unknown>element.style))[k] = v;
    });

    return element;
  }

  addAttributes<T extends HTMLElement>(
    element: T,
    attributes: Record<string, string>
  ) {
    Object.entries(attributes).forEach(([k, v]) => {
      element.setAttribute(k, v);
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
