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

    restart.onclick = function()
        {
            //HERE
        };

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


export function updateScore( score )
    {
    SCORE.innerHTML = score;
    }


export function startTimer( startTime )
    {
    TIMER.start( startTime * 1000, 0, function()
        {
            //HERE
        console.log( 'No time left!' );
        }, true );
    }

export function addToTimer( time )
    {
    TIMER.add( time * 1000 );
    }
}
