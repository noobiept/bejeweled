var GemType;
(function (GemType) {
    GemType[GemType["green_gem"] = 0] = "green_gem";
    GemType[GemType["blue_gem"] = 1] = "blue_gem";
    GemType[GemType["gray_gem"] = 2] = "gray_gem";
    GemType[GemType["purple_gem"] = 3] = "purple_gem";
    GemType[GemType["yellow_gem"] = 4] = "yellow_gem";
    GemType[GemType["red_gem"] = 5] = "red_gem";
    GemType[GemType["orange_gem"] = 6] = "orange_gem";
})(GemType || (GemType = {}));
var GemAction;
(function (GemAction) {
    GemAction[GemAction["move"] = 0] = "move";
    GemAction[GemAction["remove"] = 1] = "remove";
})(GemAction || (GemAction = {}));
var Gem = (function () {
    function Gem(id) {
        this.already_checked_horizontal = false;
        this.already_checked_vertical = false;
        this.being_animated = false;
        var _this = this;
        var shape = new createjs.Container();
        var gem = new createjs.Bitmap(G.PRELOAD.getResult(GemType[id]));
        var selection = new createjs.Bitmap(G.PRELOAD.getResult('gem_selected'));
        selection.visible = false;
        // define the area that triggers the click event
        var hitArea = new createjs.Shape();
        var g = hitArea.graphics;
        g.beginFill('black'); // its not added to the display list
        g.drawRect(0, 0, Gem.SIZE, Gem.SIZE);
        g.endFill();
        shape.regX = Gem.SIZE / 2;
        shape.regY = Gem.SIZE / 2;
        shape.hitArea = hitArea;
        shape.on('click', function () {
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
     * Initialize the gem's container.
     */
    Gem.init = function (stage) {
        Gem._CONTAINER = new createjs.Container();
        stage.addChild(Gem._CONTAINER);
    };
    /**
     * Position the gem in a position in the grid.
     */
    Gem.prototype.positionIn = function (column, line) {
        this.column = column;
        this.line = line;
        var canvasPosition = Grid.toCanvasPosition(column, line);
        this.shape.x = canvasPosition.x;
        this.shape.y = canvasPosition.y;
    };
    /**
     * Move the gem from the current position to a new one (with a move animation).
     */
    Gem.prototype.moveTo = function (column, line, callback) {
        var _this = this;
        var canvasPosition = Grid.toCanvasPosition(column, line);
        var distanceY = Math.abs(this.line - line) * Gem.SIZE;
        var distanceX = Math.abs(this.column - column) * Gem.SIZE;
        var distance;
        // moving up/down
        // can only move horizontally or vertically
        if (distanceY > distanceX) {
            distance = distanceY;
        }
        else {
            distance = distanceX;
        }
        if (distance < Gem.SIZE) {
            distance = Gem.SIZE;
        }
        this.being_animated = true;
        var duration = distance / Gem.MOVEMENT_SPEED * 1000;
        createjs.Tween.get(this.shape, { override: true }).to({
            x: canvasPosition.x,
            y: canvasPosition.y
        }, duration).call(function () {
            _this.being_animated = false;
            _this.column = column;
            _this.line = line;
            if (callback) {
                callback();
            }
        });
    };
    /**
     * Show the selection effect.
     */
    Gem.prototype.setSelection = function (value) {
        this.selection.visible = value;
    };
    /**
     * Get the current 'x' position.
     */
    Gem.prototype.getX = function () {
        return this.shape.x;
    };
    /**
     * Get the current 'y' position.
     */
    Gem.prototype.getY = function () {
        return this.shape.y;
    };
    /**
     * Remove the gem with an animation. Callback is called when the animation ends.
     */
    Gem.prototype.remove = function (callback) {
        var _this = this;
        this.being_animated = true;
        createjs.Tween.get(this.shape).to({
            scaleX: 0,
            scaleY: 0
        }, 300).call(function () {
            Gem._CONTAINER.removeChild(_this.shape);
            _this.being_animated = false;
            if (callback) {
                callback();
            }
        });
    };
    Gem.SIZE = 50;
    Gem.MOVEMENT_SPEED = 500;
    // GemType is a enum, which will have as key the gem's id, plus the associated position (so we need to divide by 2)
    Gem.TYPE_COUNT = Object.keys(GemType).length / 2;
    return Gem;
}());
