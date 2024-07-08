import { isNumber, Timeout } from "@drk4/utilities";

var CONTAINER: createjs.Container;
var TEXT: createjs.Text;
var BACKGROUND: createjs.Shape;
var TIMEOUT: Utilities.Timeout;

let getCW: () => number; // TODO

/**
 * Initialize the message elements.
 */
export function init(stage: createjs.Stage, getCanvasWidth: () => number) {
    // timeout
    TIMEOUT = new Timeout();

    getCW = getCanvasWidth;

    // canvas
    var canvas = <HTMLCanvasElement>stage.canvas;
    var halfWidth = canvas.width / 2;
    var halfHeight = canvas.height / 2;

    // background
    BACKGROUND = new createjs.Shape();

    // text
    TEXT = new createjs.Text("", "30px monospace");
    TEXT.textAlign = "center";

    // container
    CONTAINER = new createjs.Container();
    CONTAINER.addChild(BACKGROUND);
    CONTAINER.addChild(TEXT);
    CONTAINER.visible = false;
    CONTAINER.x = halfWidth;
    CONTAINER.y = halfHeight;

    stage.addChild(CONTAINER);
}

/**
 * Show a message in the center of the canvas.
 */
export function show(text: string, timeout?: number, callback?: () => void) {
    TEXT.text = text;
    drawBackground();
    CONTAINER.visible = true;

    if (isNumber(timeout)) {
        TIMEOUT.start(function () {
            CONTAINER.visible = false;

            if (callback) {
                callback();
            }
        }, timeout!);
    }
}

/**
 * Hide the message.
 */
export function hide() {
    TIMEOUT.clear();
    CONTAINER.visible = false;
}

/**
 * Draw the message's background, centered behind the message.
 */
function drawBackground() {
    const textHeight = TEXT.getMeasuredHeight() + 15;
    const canvasWidth = getCW();

    var g = BACKGROUND.graphics;

    g.beginFill("#B8CEB9");
    g.drawRect(-canvasWidth / 2, 0, canvasWidth, textHeight);
    g.endFill();
}
