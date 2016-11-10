var Game;
(function (Game) {
    var GRID;
    var GRID_SIZE = 8;
    var SELECTED = null;
    var SCORE = 0;
    var GAME_OVER = false;
    var SELECT_SOUND;
    var COMBINE_SOUND;
    /**
     * Initialize the game related stuff.
     */
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
    /**
     * Start a new game (new grid/reset score/etc).
     */
    function start() {
        GAME_OVER = false;
        SELECTED = null;
        GRID = new Grid(GRID_SIZE);
        GameMenu.startTimer(30);
        GameMenu.updateScore(SCORE);
        GameMenu.show();
    }
    Game.start = start;
    /**
     * When a gem is clicked, we either select it, or if there was a gem already selected we try to switch them.
     */
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
    /**
     * Select a gem (have a border around it).
     */
    function selectGem(gem) {
        if (SELECTED) {
            // clear the selection of previously selected gem
            SELECTED.setSelection(false);
        }
        SELECTED = gem;
        gem.setSelection(true);
        playSelectSound();
    }
    /**
     * Unselect the current selected gem (if there is one).
     */
    function unselectGem() {
        if (SELECTED) {
            SELECTED.setSelection(false);
        }
        SELECTED = null;
    }
    /**
     * Add to the current score.
     */
    function addToScore(score) {
        SCORE += score;
        GameMenu.updateScore(SCORE);
    }
    Game.addToScore = addToScore;
    /**
     * Get the current score.
     */
    function getScore() {
        return SCORE;
    }
    Game.getScore = getScore;
    /**
     * Clear the current game, and start a new one.
     */
    function restart() {
        GRID.clear();
        GRID = null;
        SCORE = 0;
        Message.hide();
        Game.start();
    }
    Game.restart = restart;
    /**
     * Select a gem that can be combined (to help the player finding a possible move).
     */
    function help() {
        var gem = GRID.isThereMoreValidMoves();
        if (gem) {
            selectGem(gem);
        }
    }
    Game.help = help;
    /**
     * Game is over, add the score to the high-score and show an ending message.
     */
    function over(message) {
        GAME_OVER = true;
        var score = Game.getScore();
        HighScore.add(score);
        Message.show(message + '\nScore: ' + score, 2000, function () {
            Game.restart();
        });
    }
    Game.over = over;
    /**
     * When a gem is selected, play a sound.
     */
    function playSelectSound() {
        SELECT_SOUND.currentTime = 0;
        SELECT_SOUND.play();
    }
    Game.playSelectSound = playSelectSound;
    /**
     * When there's a gem combination, play a sound.
     */
    function playCombineSound() {
        COMBINE_SOUND.currentTime = 0;
        COMBINE_SOUND.play();
    }
    Game.playCombineSound = playCombineSound;
})(Game || (Game = {}));
