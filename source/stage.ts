import type { Size } from "./types";

export class Stage {
    private canvas: HTMLCanvasElement;
    private stage: createjs.Stage;
    private onTickListeners: ((event: createjs.TickerEvent) => void)[] = [];

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.stage = new createjs.Stage(canvas);
        createjs.Ticker.timingMode = createjs.Ticker.RAF;

        createjs.Ticker.on("tick", (event: createjs.TickerEvent) => {
            this.onTickListeners.forEach((listener) => listener(event));
            this.stage.update();
        });
    }

    setSize({ width, height }: Size) {
        this.canvas.width = width;
        this.canvas.height = height;
    }

    getSize(): Size {
        return {
            width: this.canvas.width,
            height: this.canvas.height,
        };
    }

    addTickListener(listener: (event: createjs.TickerEvent) => void) {
        this.onTickListeners.push(listener);
    }

    addChild(child: createjs.DisplayObject) {
        this.stage.addChild(child);
    }

    clean() {
        this.stage.removeAllChildren();
        createjs.Ticker.removeAllEventListeners();
    }
}
