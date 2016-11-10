var Message;
(function (Message) {
    var CONTAINER;
    var TEXT;
    var BACKGROUND;
    var TIMEOUT;
    /**
     * Initialize the message elements.
     */
    function init(stage) {
        // timeout
        TIMEOUT = new Utilities.Timeout();
        // canvas
        var canvas = stage.canvas;
        var halfWidth = canvas.width / 2;
        var halfHeight = canvas.height / 2;
        // background
        BACKGROUND = new createjs.Shape();
        // text
        TEXT = new createjs.Text('', '30px monospace');
        TEXT.textAlign = 'center';
        // container
        CONTAINER = new createjs.Container();
        CONTAINER.addChild(BACKGROUND);
        CONTAINER.addChild(TEXT);
        CONTAINER.visible = false;
        CONTAINER.x = halfWidth;
        CONTAINER.y = halfHeight;
        stage.addChild(CONTAINER);
    }
    Message.init = init;
    /**
     * Show a message in the center of the canvas.
     */
    function show(text, timeout, callback) {
        TEXT.text = text;
        drawBackground();
        CONTAINER.visible = true;
        if (Utilities.isNumber(timeout)) {
            TIMEOUT.start(function () {
                CONTAINER.visible = false;
                if (callback) {
                    callback();
                }
            }, timeout);
        }
    }
    Message.show = show;
    /**
     * Hide the message.
     */
    function hide() {
        TIMEOUT.clear();
        CONTAINER.visible = false;
    }
    Message.hide = hide;
    /**
     * Draw the message's background, centered behind the message.
     */
    function drawBackground() {
        var textHeight = TEXT.getMeasuredHeight() + 15;
        var canvas = G.CANVAS;
        var g = BACKGROUND.graphics;
        g.beginFill('#B8CEB9');
        g.drawRect(-canvas.width / 2, 0, canvas.width, textHeight);
        g.endFill();
    }
})(Message || (Message = {}));
