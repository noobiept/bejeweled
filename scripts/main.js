/// <reference path="../typings/tsd.d.ts" />
/// <reference path="gem.ts" />
/// <reference path="grid.ts" />
var G = {
    CANVAS: null,
    STAGE: null,
    PRELOAD: null
};
var BASE_PATH = '';
window.onload = function () {
    // setting up the canvas and stage
    G.CANVAS = document.querySelector('#MainCanvas');
    G.STAGE = new createjs.Stage(G.CANVAS);
    var width = 600;
    var height = 400;
    G.CANVAS.width = width;
    G.CANVAS.height = height;
    // init of the game parts
    Gem.init(G.STAGE);
    // preload part
    G.PRELOAD = new createjs.LoadQueue();
    var manifest = {
        path: BASE_PATH + 'images/',
        manifest: [
            { id: 'blue_gem', src: 'element_blue_polygon.png' }
        ]
    };
    G.PRELOAD.on('complete', function (event) {
        start();
    });
    G.PRELOAD.loadManifest(manifest, true);
};
function start() {
    var grid = new Grid(8);
    createjs.Ticker.on('tick', function (event) {
        G.STAGE.update();
    });
}
