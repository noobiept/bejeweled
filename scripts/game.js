var Game;
(function (Game) {
    var GRID;
    var SELECTED = null;
    var TYPES_OF_GEMS = ['green_gem', 'blue_gem'];
    function start() {
        GRID = new Grid(8, TYPES_OF_GEMS);
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
            // clicked the already selected gem, deselect
            if (gem === SELECTED) {
            }
            else {
                // can only switch adjacent gems
                if (GRID.areGemsAdjacent(gem, SELECTED)) {
                    GRID.switchGems(gem, SELECTED);
                }
                else {
                    console.log("Gems aren't adjacent.");
                }
            }
            SELECTED.setSelection(false);
            SELECTED = null;
        }
    }
    Game.gemClicked = gemClicked;
})(Game || (Game = {}));
