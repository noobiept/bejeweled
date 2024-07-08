import { Grid } from "./grid";
import { getAsset } from "./preload";

import * as Game from "./game";

enum GemType {
    green_gem,
    blue_gem,
    gray_gem,
    purple_gem,
    yellow_gem,
    red_gem,
    orange_gem,
}

enum GemAction {
    move,
    remove,
}

export class Gem {
    static _CONTAINER: createjs.Container;
    static SIZE = 50;
    static MOVEMENT_SPEED = 500;

    // GemType is a enum, which will have as key the gem's id, plus the associated position (so we need to divide by 2)
    static TYPE_COUNT = Object.keys(GemType).length / 2;

    /**
     * Initialize the gem's container.
     */
    static init(stage: createjs.Stage) {
        Gem._CONTAINER = new createjs.Container();

        stage.addChild(Gem._CONTAINER);
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

    constructor(id: GemType) {
        var _this = this;

        var shape = new createjs.Container();
        var gem = new createjs.Bitmap(<HTMLImageElement>getAsset(GemType[id]));
        var selection = new createjs.Bitmap(
            <HTMLImageElement>getAsset("gem_selected")
        );

        selection.visible = false;

        // define the area that triggers the click event
        var hitArea = new createjs.Shape();

        var g = hitArea.graphics;

        g.beginFill("black"); // its not added to the display list
        g.drawRect(0, 0, Gem.SIZE, Gem.SIZE);
        g.endFill();

        shape.regX = Gem.SIZE / 2;
        shape.regY = Gem.SIZE / 2;
        shape.hitArea = hitArea;
        shape.on("click", function () {
            if (!_this.being_animated) {
                Game.gemClicked(_this);
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

        var canvasPosition = Grid.toCanvasPosition(column, line);

        this.shape.x = canvasPosition.x;
        this.shape.y = canvasPosition.y;
    }

    /**
     * Move the gem from the current position to a new one (with a move animation).
     */
    moveTo(column: number, line: number, callback?: () => any) {
        var _this = this;

        var canvasPosition = Grid.toCanvasPosition(column, line);
        var distanceY = Math.abs(this.line - line) * Gem.SIZE;
        var distanceX = Math.abs(this.column - column) * Gem.SIZE;
        var distance: number;

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

        var duration = (distance / Gem.MOVEMENT_SPEED) * 1000;

        createjs.Tween.get(this.shape, { override: true })
            .to(
                {
                    x: canvasPosition.x,
                    y: canvasPosition.y,
                },
                duration
            )
            .call(function () {
                _this.being_animated = false;
                _this.column = column;
                _this.line = line;

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
    remove(callback?: () => any) {
        var _this = this;
        this.being_animated = true;

        createjs.Tween.get(this.shape)
            .to(
                {
                    scaleX: 0,
                    scaleY: 0,
                },
                300
            )
            .call(function () {
                Gem._CONTAINER.removeChild(_this.shape);
                _this.being_animated = false;

                if (callback) {
                    callback();
                }
            });
    }
}
