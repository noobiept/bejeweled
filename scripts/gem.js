var Gem = (function () {
    function Gem(id) {
        var shape = new createjs.Bitmap(G.PRELOAD.getResult(id));
        Gem._CONTAINER.addChild(shape);
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
    Gem.SIZE = 50;
    return Gem;
})();
