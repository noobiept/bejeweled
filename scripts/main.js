/// <reference path="../typings/tsd.d.ts" />
/// <reference path="../typings/utilities-1.2.d.ts" />
/// <reference path="gem.ts" />
/// <reference path="grid.ts" />
/// <reference path="game.ts" />
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
            { id: 'gem_selected', src: 'gem_selected.png' },
            { id: 'blue_gem', src: 'blue_gem.png' },
            { id: 'green_gem', src: 'green_gem.png' },
            { id: 'gray_gem', src: 'gray_gem.png' },
            { id: 'purple_gem', src: 'purple_gem.png' },
            { id: 'yellow_gem', src: 'gray_gem.png' },
            { id: 'red_gem', src: 'red_gem.png' },
            { id: 'orange_gem', src: 'orange_gem.png' }
        ]
    };
    G.PRELOAD.on('complete', function (event) {
        Game.start();
    });
    G.PRELOAD.loadManifest(manifest, true);
};
