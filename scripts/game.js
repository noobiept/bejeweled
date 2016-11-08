var Game;
(function (Game) {
    var GRID;
    var SELECTED = null;
    var SCORE = 0;
    var GRID_SIZE = 8;
    function init() {
        G.CANVAS.width = GRID_SIZE * Gem.SIZE;
        G.CANVAS.height = GRID_SIZE * Gem.SIZE;
        createjs.Ticker.on('tick', function (event) {
            G.STAGE.update();
            if (GRID) {
                GRID.tick();
            }
        });
    }
    Game.init = init;
    function start() {
        GRID = new Grid(GRID_SIZE);
        GameMenu.startTimer(30);
        GameMenu.updateScore(SCORE);
        GameMenu.show();
    }
    Game.start = start;
    function gemClicked(gem) {
        // no selection yet
        if (SELECTED === null) {
            SELECTED = gem;
            gem.setSelection(true);
        }
        else {
            // clear the selection of previously selected gem
            SELECTED.setSelection(false);
            // clicked the already selected gem, deselect
            if (gem === SELECTED) {
                SELECTED = null;
            }
            else {
                if (SELECTED.is_moving || SELECTED.being_worked_on ||
                    gem.is_moving || gem.being_worked_on) {
                    SELECTED.setSelection(false);
                    SELECTED = null;
                    return;
                }
                // can only switch adjacent gems
                if (GRID.isValidSwitch(gem, SELECTED)) {
                    GRID.switchGems(gem, SELECTED);
                    SELECTED = null;
                }
                else {
                    SELECTED = gem;
                    gem.setSelection(true);
                }
            }
        }
    }
    Game.gemClicked = gemClicked;
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
})(Game || (Game = {}));
