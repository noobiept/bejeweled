import { isNumber, Timeout } from "@drk4/utilities";
import type { Stage } from "./stage";

let CONTAINER: createjs.Container;
let TEXT: createjs.Text;
let BACKGROUND: createjs.Shape;
let TIMEOUT: Timeout;

let GET_CANVAS_WIDTH: () => number;
const PADDING = 10;

/**
 * Initialize the message elements.
 */
export function init(stage: Stage) {
    // timeout
    TIMEOUT = new Timeout();

    // canvas
    const size = stage.getSize();
    const halfWidth = size.width / 2;
    const halfHeight = size.height / 2;

    GET_CANVAS_WIDTH = () => stage.getSize().width;

    // background
    BACKGROUND = new createjs.Shape();

    // text
    TEXT = new createjs.Text("", "30px monospace");
    TEXT.textAlign = "center";
    TEXT.lineHeight = TEXT.getMeasuredLineHeight() + PADDING;

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

    const textHeight = TEXT.getMeasuredHeight();
    TEXT.y = -textHeight / 2;

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
    const textHeight = TEXT.getMeasuredHeight() + PADDING;
    const canvasWidth = GET_CANVAS_WIDTH();

    const g = BACKGROUND.graphics;

    g.beginFill("#B8CEB9");
    g.drawRect(-canvasWidth / 2, -textHeight / 2, canvasWidth, textHeight);
    g.endFill();
}
