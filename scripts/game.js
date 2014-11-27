var Game;
(function (Game) {
    var GRID;
    var SELECTED = null;
    var TYPES_OF_GEMS = ['green_gem', 'blue_gem', 'gray_gem', 'purple_gem', 'yellow_gem', 'red_gem', 'orange_gem'];
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
            // clear the selection of previously selected gem
            SELECTED.setSelection(false);
            // clicked the already selected gem, deselect
            if (gem === SELECTED) {
                SELECTED = null;
            }
            else {
                // can only switch adjacent gems
                if (GRID.areGemsAdjacent(gem, SELECTED)) {
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
})(Game || (Game = {}));
