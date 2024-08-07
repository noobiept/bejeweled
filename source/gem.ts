import { getAsset } from "./preload";

import { GemType } from "./types";
import type { Stage } from "./stage";

export type GemArgs = {
    id: GemType;
    onClick: (gem: Gem) => void;
};

export class Gem {
    static _CONTAINER: createjs.Container;
    static SIZE = 50;
    static MOVEMENT_SPEED = 500;

    // GemType is a enum, which will have as key the gem's id, plus the associated position (so we need to divide by 2)
    static TYPE_COUNT = Object.keys(GemType).length / 2;

    /**
     * Initialize the gem's container.
     */
    static init(stage: Stage) {
        Gem._CONTAINER = new createjs.Container();

        stage.addChild(Gem._CONTAINER);
    }

    /**
     * Convert a column/line position to an x/y position.
     */
    static toCanvasPosition(column: number, line: number) {
        return {
            x: column * Gem.SIZE + Gem.SIZE / 2,
            y: line * Gem.SIZE + Gem.SIZE / 2,
        };
    }

    shape: createjs.Container;
    gem: createjs.Bitmap;
    selection: createjs.Bitmap;
    column: number;
    line: number;
    id: GemType;
    already_checked_horizontal = false;
    already_checked_vertical = false;
    being_animated = false;

    constructor({ id, onClick }: GemArgs) {
        const shape = new createjs.Container();
        const gem = new createjs.Bitmap(
            <HTMLImageElement>getAsset(GemType[id])
        );
        const selection = new createjs.Bitmap(
            <HTMLImageElement>getAsset("gem_selected")
        );

        selection.visible = false;

        // define the area that triggers the click event
        const hitArea = new createjs.Shape();

        const g = hitArea.graphics;

        g.beginFill("black"); // its not added to the display list
        g.drawRect(0, 0, Gem.SIZE, Gem.SIZE);
        g.endFill();

        shape.regX = Gem.SIZE / 2;
        shape.regY = Gem.SIZE / 2;
        shape.hitArea = hitArea;
        shape.on("click", () => {
            if (!this.being_animated) {
                onClick(this);
            }
        });

        shape.addChild(selection);
        shape.addChild(gem);

        Gem._CONTAINER.addChild(shape);

        this.column = -1; // need to call positionIn() or moveTo() to position the gem
        this.line = -1;
        this.gem = gem;
        this.selection = selection;
        this.shape = shape;
        this.id = id;
    }

    /**
     * Position the gem in a position in the grid.
     */
    positionIn(column: number, line: number) {
        this.column = column;
        this.line = line;

        const canvasPosition = Gem.toCanvasPosition(column, line);

        this.shape.x = canvasPosition.x;
        this.shape.y = canvasPosition.y;
    }

    /**
     * Move the gem from the current position to a new one (with a move animation).
     */
    moveTo(column: number, line: number, callback?: () => void) {
        const canvasPosition = Gem.toCanvasPosition(column, line);
        const distanceY = Math.abs(this.line - line) * Gem.SIZE;
        const distanceX = Math.abs(this.column - column) * Gem.SIZE;
        let distance: number;

        // moving up/down
        // can only move horizontally or vertically
        if (distanceY > distanceX) {
            distance = distanceY;
        }

        // moving left/right
        else {
            distance = distanceX;
        }

        if (distance < Gem.SIZE) {
            distance = Gem.SIZE;
        }

        this.being_animated = true;

        const duration = (distance / Gem.MOVEMENT_SPEED) * 1000;

        createjs.Tween.get(this.shape, { override: true })
            .to(
                {
                    x: canvasPosition.x,
                    y: canvasPosition.y,
                },
                duration
            )
            .call(() => {
                this.being_animated = false;
                this.column = column;
                this.line = line;

                if (callback) {
                    callback();
                }
            });
    }

    /**
     * Show the selection effect.
     */
    setSelection(value: boolean) {
        this.selection.visible = value;
    }

    /**
     * Get the current 'x' position.
     */
    getX() {
        return this.shape.x;
    }

    /**
     * Get the current 'y' position.
     */
    getY() {
        return this.shape.y;
    }

    /**
     * Remove the gem with an animation. Callback is called when the animation ends.
     */
    remove(callback?: () => void) {
        this.being_animated = true;

        createjs.Tween.get(this.shape)
            .to(
                {
                    scaleX: 0,
                    scaleY: 0,
                },
                300
            )
            .call(() => {
                Gem._CONTAINER.removeChild(this.shape);
                this.being_animated = false;

                if (callback) {
                    callback();
                }
            });
    }
}
