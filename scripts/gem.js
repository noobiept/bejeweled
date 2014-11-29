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
var Gem = (function () {
    function Gem(id, column, line) {
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
        shape.hitArea = hitArea;
        shape.on('click', function () {
            if (!_this.is_moving) {
                Game.gemClicked(_this);
            }
        });
        shape.addChild(selection);
        shape.addChild(gem);
        Gem._CONTAINER.addChild(shape);
        this.column = column;
        this.line = line;
        this.gem = gem;
        this.selection = selection;
        this.shape = shape;
        this.is_moving = false;
        this.id = id;
    }
    Gem.init = function (stage) {
        Gem._CONTAINER = new createjs.Container();
        stage.addChild(Gem._CONTAINER);
    };
    Gem.prototype.positionIn = function (x, y) {
        this.shape.x = x;
        this.shape.y = y;
    };
    Gem.prototype.moveTo = function (x, y) {
        var _this = this;
        this.is_moving = true;
        createjs.Tween.get(this.shape, { override: true }).to({
            x: x,
            y: y
        }, 500).call(function () {
            _this.is_moving = false;
        });
    };
    Gem.prototype.setSelection = function (value) {
        this.selection.visible = value;
    };
    Gem.prototype.getX = function () {
        return this.shape.x;
    };
    Gem.prototype.getY = function () {
        return this.shape.y;
    };
    Gem.prototype.remove = function () {
        createjs.Tween.removeTweens(this.shape);
        Gem._CONTAINER.removeChild(this.shape);
    };
    Gem.SIZE = 50;
    return Gem;
})();
