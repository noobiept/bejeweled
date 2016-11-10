var Game;
(function (Game) {
    var GRID;
    var SELECTED = null;
    var SCORE = 0;
    var GRID_SIZE = 8;
    var GAME_OVER = false;
    var SELECT_SOUND;
    var COMBINE_SOUND;
    function init() {
        G.CANVAS.width = GRID_SIZE * Gem.SIZE;
        G.CANVAS.height = GRID_SIZE * Gem.SIZE;
        SELECT_SOUND = new Audio('../sounds/select.wav');
        SELECT_SOUND.load();
        COMBINE_SOUND = new Audio('../sounds/combine.wav');
        COMBINE_SOUND.load();
        createjs.Ticker.on('tick', function (event) {
            G.STAGE.update();
            if (GRID && !GAME_OVER) {
                GRID.tick();
            }
        });
    }
    Game.init = init;
    function start() {
        GAME_OVER = false;
        SELECTED = null;
        GRID = new Grid(GRID_SIZE);
        GameMenu.startTimer(30);
        GameMenu.updateScore(SCORE);
        GameMenu.show();
    }
    Game.start = start;
    function gemClicked(gem) {
        // no selection yet
        if (SELECTED === null) {
            selectGem(gem);
        }
        else {
            // clicked the already selected gem, deselect
            if (gem === SELECTED) {
                unselectGem();
            }
            else {
                if (SELECTED.being_animated || gem.being_animated) {
                    unselectGem();
                    return;
                }
                // can only switch adjacent gems
                if (GRID.isValidSwitch(gem, SELECTED)) {
                    GRID.switchGems(gem, SELECTED);
                    unselectGem();
                }
                else {
                    selectGem(gem);
                }
            }
        }
    }
    Game.gemClicked = gemClicked;
    function selectGem(gem) {
        if (SELECTED) {
            // clear the selection of previously selected gem
            SELECTED.setSelection(false);
        }
        SELECTED = gem;
        gem.setSelection(true);
        playSelectSound();
    }
    function unselectGem() {
        if (SELECTED) {
            SELECTED.setSelection(false);
        }
        SELECTED = null;
    }
    function addToScore(score) {
        SCORE += score;
        GameMenu.updateScore(SCORE);
    }
    Game.addToScore = addToScore;
    function getScore() {
        return SCORE;
    }
    Game.getScore = getScore;
    function restart() {
        GRID.clear();
        GRID = null;
        SCORE = 0;
        Message.hide();
        Game.start();
    }
    Game.restart = restart;
    function help() {
        var gem = GRID.isThereMoreValidMoves();
        selectGem(gem);
    }
    Game.help = help;
    function over() {
        GAME_OVER = true;
        var score = Game.getScore();
        HighScore.add(score);
        Message.show('No more valid moves!\nScore: ' + score, 2000, function () {
            Game.restart();
        });
    }
    Game.over = over;
    function playSelectSound() {
        SELECT_SOUND.currentTime = 0;
        SELECT_SOUND.play();
    }
    Game.playSelectSound = playSelectSound;
    function playCombineSound() {
        COMBINE_SOUND.currentTime = 0;
        COMBINE_SOUND.play();
    }
    Game.playCombineSound = playCombineSound;
})(Game || (Game = {}));
