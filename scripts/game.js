var Game;
(function (Game) {
    var GRID;
    var SELECTED = null;
    var SCORE = 0;
    function start() {
        var gridSize = 8;
        G.CANVAS.width = gridSize * Gem.SIZE;
        G.CANVAS.height = gridSize * Gem.SIZE;
        GRID = new Grid(gridSize);
        GameMenu.startTimer(40);
        GameMenu.updateScore(SCORE);
        GameMenu.show();
        createjs.Ticker.on('tick', function (event) {
            G.STAGE.update();
        });
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
})(Game || (Game = {}));
