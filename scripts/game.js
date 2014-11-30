var Game;
(function (Game) {
    var GRID;
    var SELECTED = null;
    function start() {
        GRID = new Grid(8);
        createjs.Ticker.on('tick', function (event) {
            G.STAGE.update();
        });
        clearChains();
    }
    Game.start = start;
    function clearChains() {
        while (GRID.checkForChains()) {
            GRID.reAddGems();
        }
    }
    Game.clearChains = clearChains;
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
                    //HERE - check if it leads to a 3+ chain of same type/color gem
                    Game.clearChains();
                }
                else {
                    SELECTED = gem;
                    gem.setSelection(true);
                }
            }
        }
    }
    Game.gemClicked = gemClicked;
})(Game || (Game = {}));
