/// <reference path="../typings/browser.d.ts" />
/// <reference path="../typings/utilities-1.4.d.ts" />
/// <reference path="gem.ts" />
/// <reference path="grid.ts" />
/// <reference path="game.ts" />
/// <reference path="game_menu.ts" />
/// <reference path="message.ts" />
/// <reference path="high_score.ts" />

interface Global {
    CANVAS: HTMLCanvasElement;
    STAGE: createjs.Stage;
    PRELOAD: createjs.LoadQueue;
}

interface GemChain {
    line: number;
    column: number;
    size: number;
}


var G: Global;


/**
 * Start of the program.
 */
window.onload = function()
{
    // setting up the canvas and stage
var canvas = <HTMLCanvasElement> document.querySelector( '#MainCanvas' );

G = {
    CANVAS: canvas,
    STAGE: new createjs.Stage( canvas ),
    PRELOAD: new createjs.LoadQueue()
};

createjs.Ticker.timingMode = createjs.Ticker.RAF;

    // init of the game parts
Game.init();
Gem.init( G.STAGE );
Message.init( G.STAGE );
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

G.PRELOAD.on( 'progress', function( event: createjs.ProgressEvent )
    {
    Message.show( 'Loading.. ' + (event.progress * 100 | 0) + '%' );
    });
G.PRELOAD.on( 'complete', function( event )
    {
    Message.hide();
    Game.start();
    });
G.PRELOAD.loadManifest( manifest, true );
};
