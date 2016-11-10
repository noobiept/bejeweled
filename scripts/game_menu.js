var GameMenu;
(function (GameMenu) {
    var CONTAINER;
    var SCORE;
    var HIGH_SCORE;
    var TIMER;
    /**
     * Initialize the game menu.
     */
    function init() {
        var container = document.querySelector('#GameMenu');
        var restart = container.querySelector('#Restart');
        restart.onclick = Game.restart;
        var help = document.getElementById('Help');
        help.onclick = Game.help;
        SCORE = container.querySelector('#Score');
        HIGH_SCORE = document.getElementById('HighScore');
        var timerValue = container.querySelector('#Timer');
        TIMER = new Utilities.Timer(timerValue);
        CONTAINER = container;
    }
    GameMenu.init = init;
    /**
     * Show the game menu.
     */
    function show() {
        CONTAINER.style.visibility = 'visible';
    }
    GameMenu.show = show;
    /**
     * Hide the game menu.
     */
    function hide() {
        CONTAINER.style.visibility = 'hidden';
    }
    GameMenu.hide = hide;
    /**
     * Update the game menu with the current score.
     */
    function updateScore(score) {
        SCORE.innerHTML = score.toString();
    }
    GameMenu.updateScore = updateScore;
    /**
     * Start the game timer, when the time runs out the game is over.
     */
    function startTimer(startTime) {
        TIMER.start(startTime * 1000, 0, function () {
            Game.over('No time left!');
        }, true);
    }
    GameMenu.startTimer = startTimer;
    /**
     * Increase the current value of the count down timer (this happens when a gem combination is made).
     */
    function addToTimer(time) {
        TIMER.add(time * 1000);
    }
    GameMenu.addToTimer = addToTimer;
    /**
     * Update menu with the current highest score.
     */
    function updateHighScore(score) {
        HIGH_SCORE.innerHTML = score.toString();
    }
    GameMenu.updateHighScore = updateHighScore;
})(GameMenu || (GameMenu = {}));
