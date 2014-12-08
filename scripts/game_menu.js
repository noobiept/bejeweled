var GameMenu;
(function (GameMenu) {
    var CONTAINER;
    var SCORE;
    var TIMER;
    function init() {
        var container = document.querySelector('#GameMenu');
        // restart //
        var restart = container.querySelector('#Restart');
        restart.onclick = function () {
            Game.restart();
        };
        // score //
        SCORE = container.querySelector('#Score');
        // timer //
        var timerValue = container.querySelector('#Timer');
        TIMER = new Utilities.Timer(timerValue);
        CONTAINER = container;
    }
    GameMenu.init = init;
    function show() {
        CONTAINER.style.visibility = 'visible';
    }
    GameMenu.show = show;
    function hide() {
        CONTAINER.style.visibility = 'hidden';
    }
    GameMenu.hide = hide;
    function updateScore(score) {
        SCORE.innerHTML = score;
    }
    GameMenu.updateScore = updateScore;
    function startTimer(startTime) {
        TIMER.start(startTime * 1000, 0, function () {
            //HERE
            console.log('No time left!');
        }, true);
    }
    GameMenu.startTimer = startTimer;
    function addToTimer(time) {
        TIMER.add(time * 1000);
    }
    GameMenu.addToTimer = addToTimer;
})(GameMenu || (GameMenu = {}));
