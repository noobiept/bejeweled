module GameMenu
{
var CONTAINER: HTMLElement;
var SCORE: HTMLElement;
var TIMER: Utilities.Timer;


/**
 * Initialize the game menu.
 */
export function init()
    {
    var container = <HTMLElement> document.querySelector( '#GameMenu' );

    var restart = <HTMLElement> container.querySelector( '#Restart' );
    restart.onclick = Game.restart;

    var help = <HTMLElement> document.getElementById( 'Help' );
    help.onclick = Game.help;

    SCORE = <HTMLElement> container.querySelector( '#Score' );

    var timerValue = <HTMLElement> container.querySelector( '#Timer' );

    TIMER = new Utilities.Timer( timerValue );
    CONTAINER = container;
    }


/**
 * Show the game menu.
 */
export function show()
    {
    CONTAINER.style.visibility = 'visible';
    }


/**
 * Hide the game menu.
 */
export function hide()
    {
    CONTAINER.style.visibility = 'hidden';
    }


/**
 * Update the game menu with the current score.
 */
export function updateScore( score: number )
    {
    SCORE.innerHTML = score.toString();
    }


/**
 * Start the game timer, when the time runs out the game is over.
 */
export function startTimer( startTime: number )
    {
    TIMER.start( startTime * 1000, 0, function()
        {
        Game.over( 'No time left!' );
        }, true );
    }


/**
 * Increase the current value of the count down timer (this happens when a gem combination is made).
 */
export function addToTimer( time: number )
    {
    TIMER.add( time * 1000 );
    }
}
