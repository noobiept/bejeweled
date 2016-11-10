var HighScore;
(function (HighScore) {
    var BEST_SCORE;
    /**
     * Initialize the high-score elements, and load the current highest score from the local storage.
     */
    function init() {
        BEST_SCORE = 0;
        load();
        GameMenu.updateHighScore(BEST_SCORE);
    }
    HighScore.init = init;
    /**
     * Compare a score with the current highest score, if its higher it becomes the high score.
     */
    function add(score) {
        if (score > BEST_SCORE) {
            BEST_SCORE = score;
            save();
            GameMenu.updateHighScore(BEST_SCORE);
        }
    }
    HighScore.add = add;
    /**
     * Get the highest score from the local storage.
     */
    function load() {
        var score = Utilities.getObject('bejeweled_high_score');
        if (score !== null) {
            BEST_SCORE = score;
        }
    }
    /**
     * Save the current high score to the local storage.
     */
    function save() {
        Utilities.saveObject('bejeweled_high_score', BEST_SCORE);
    }
    /**
     * Reset the high score.
     */
    function clear() {
        BEST_SCORE = 0;
        save();
        GameMenu.updateHighScore(BEST_SCORE);
    }
    HighScore.clear = clear;
})(HighScore || (HighScore = {}));
