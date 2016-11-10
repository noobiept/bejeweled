module GameMenu
{
var CONTAINER: HTMLElement;
var SCORE: HTMLElement;
var TIMER: Utilities.Timer;

export function init()
    {
    var container = <HTMLElement> document.querySelector( '#GameMenu' );

        // restart //
    var restart = <HTMLElement> container.querySelector( '#Restart' );
    restart.onclick = Game.restart;

        // help //
    var help = <HTMLElement> document.getElementById( 'Help' );
    help.onclick = Game.help;

        // score //
    SCORE = <HTMLElement> container.querySelector( '#Score' );

        // timer //
    var timerValue = <HTMLElement> container.querySelector( '#Timer' );

    TIMER = new Utilities.Timer( timerValue );

    CONTAINER = container;
    }


export function show()
    {
    CONTAINER.style.visibility = 'visible';
    }


export function hide()
    {
    CONTAINER.style.visibility = 'hidden';
    }


export function updateScore( score: number )
    {
    SCORE.innerHTML = score.toString();
    }


export function startTimer( startTime: number )
    {
    TIMER.start( startTime * 1000, 0, function()
        {
        var score = Game.getScore();

        HighScore.add( score );

        Message.show( 'No time left!\nScore: ' + score, 2000, function()
            {
            Game.restart();
            });
        }, true );
    }

export function addToTimer( time: number )
    {
    TIMER.add( time * 1000 );
    }
}
