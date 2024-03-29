/// <reference path="../libraries/utilities-1.4.d.ts" />
var G;
/**
 * Start of the program.
 */
window.onload = function () {
    // setting up the canvas and stage
    var canvas = document.querySelector('#MainCanvas');
    G = {
        CANVAS: canvas,
        STAGE: new createjs.Stage(canvas),
        PRELOAD: new createjs.LoadQueue()
    };
    createjs.Ticker.timingMode = createjs.Ticker.RAF;
    // init of the game parts
    Game.init();
    Gem.init(G.STAGE);
    Message.init(G.STAGE);
    GameMenu.init();
    HighScore.init();
    // preload part
    var manifest = {
        path: 'images/',
        manifest: [
            { id: 'gem_selected', src: 'gem_selected.png' },
            { id: 'blue_gem', src: 'blue_gem.png' },
            { id: 'green_gem', src: 'green_gem.png' },
            { id: 'gray_gem', src: 'gray_gem.png' },
            { id: 'purple_gem', src: 'purple_gem.png' },
            { id: 'yellow_gem', src: 'yellow_gem.png' },
            { id: 'red_gem', src: 'red_gem.png' },
            { id: 'orange_gem', src: 'orange_gem.png' }
        ]
    };
    G.PRELOAD.on('progress', function (event) {
        Message.show('Loading.. ' + (event.progress * 100 | 0) + '%');
    });
    G.PRELOAD.on('complete', function (event) {
        Message.hide();
        Game.start();
    });
    G.PRELOAD.loadManifest(manifest, true);
};
