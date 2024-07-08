import * as Game from "./game";
import * as GameMenu from "./game_menu";
import { Gem } from "./gem";
import * as HighScore from "./high_score";
import * as Message from "./message";
import * as Preload from "./preload";

/**
 * Start of the program.
 */
window.onload = function () {
    // setting up the canvas and stage
    const canvas = <HTMLCanvasElement>document.querySelector("#MainCanvas");

    const stage = new createjs.Stage(canvas);

    createjs.Ticker.timingMode = createjs.Ticker.RAF;

    // init of the game parts
    Game.init(canvas, stage);
    Gem.init(stage);
    Message.init(stage, () => canvas.width);
    GameMenu.init();
    HighScore.init();
    Preload.init();

    // preload part
    const manifest = {
        path: "images/",
        manifest: [
            { id: "gem_selected", src: "gem_selected.png" },

            { id: "blue_gem", src: "blue_gem.png" },
            { id: "green_gem", src: "green_gem.png" },
            { id: "gray_gem", src: "gray_gem.png" },
            { id: "purple_gem", src: "purple_gem.png" },
            { id: "yellow_gem", src: "yellow_gem.png" },
            { id: "red_gem", src: "red_gem.png" },
            { id: "orange_gem", src: "orange_gem.png" },
        ],
    };
    Preload.load({
        manifest,
        onProgress: (event: createjs.ProgressEvent) => {
            Message.show("Loading.. " + ((event.progress * 100) | 0) + "%");
        },
        onComplete: () => {
            Message.hide();
            Game.start();
        },
    });
};
