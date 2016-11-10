var HighScore;
(function (HighScore) {
    var BEST_SCORE;
    function init() {
        BEST_SCORE = 0;
        load();
        GameMenu.updateHighScore(BEST_SCORE);
    }
    HighScore.init = init;
    function add(score) {
        if (score > BEST_SCORE) {
            BEST_SCORE = score;
            save();
            GameMenu.updateHighScore(BEST_SCORE);
        }
    }
    HighScore.add = add;
    function load() {
        var score = Utilities.getObject('bejeweled_high_score');
        if (score !== null) {
            BEST_SCORE = score;
        }
    }
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
