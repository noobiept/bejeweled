var Message;
(function (Message) {
    var CONTAINER;
    var TEXT;
    var TIMEOUT;
    function init(stage) {
        CONTAINER = new createjs.Container();
        TIMEOUT = new Utilities.Timeout();
        TEXT = new createjs.Text('', '20px monospace');
        TEXT.visible = false;
        TEXT.textAlign = 'center';
        TEXT.x = stage.canvas.width / 2;
        TEXT.y = stage.canvas.height / 2;
        CONTAINER.addChild(TEXT);
        stage.addChild(CONTAINER);
    }
    Message.init = init;
    function show(text, timeout, callback) {
        TEXT.text = text;
        TEXT.visible = true;
        if (Utilities.isNumber(timeout)) {
            TIMEOUT.start(function () {
                TEXT.visible = false;
                if (callback) {
                    callback();
                }
            }, 1000);
        }
    }
    Message.show = show;
    function hide() {
        TIMEOUT.clear();
        TEXT.visible = false;
    }
    Message.hide = hide;
})(Message || (Message = {}));
