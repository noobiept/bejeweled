var Gem = (function () {
    function Gem(id, column, line) {
        var _this = this;
        var shape = new createjs.Container();
        var gem = new createjs.Bitmap(G.PRELOAD.getResult(id));
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
            Game.gemClicked(_this);
        });
        shape.addChild(selection);
        shape.addChild(gem);
        Gem._CONTAINER.addChild(shape);
        this.column = column;
        this.line = line;
        this.gem = gem;
        this.selection = selection;
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
        this.selection.visible = value;
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
