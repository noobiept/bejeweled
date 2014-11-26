var Gem = (function () {
    function Gem(id, column, line) {
        var _this = this;
        var shape = new createjs.Bitmap(G.PRELOAD.getResult(id));
        shape.on('click', function () {
            Game.gemClicked(_this);
        });
        Gem._CONTAINER.addChild(shape);
        this.column = column;
        this.line = line;
        this.shape = shape;
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
        this.positionIn(x, y); //HERE
    };
    Gem.prototype.setSelection = function (value) {
    };
    Gem.prototype.getX = function () {
        return this.shape.x;
    };
    Gem.prototype.getY = function () {
        return this.shape.y;
    };
    Gem.SIZE = 50;
    return Gem;
})();
