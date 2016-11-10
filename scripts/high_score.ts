module HighScore
{
var BEST_SCORE: number;


/**
 * Initialize the high-score elements, and load the current highest score from the local storage.
 */
export function init()
    {
    BEST_SCORE = 0;

    load();
    GameMenu.updateHighScore( BEST_SCORE );
    }


/**
 * Compare a score with the current highest score, if its higher it becomes the high score.
 */
export function add( score: number )
    {
    if ( score > BEST_SCORE )
        {
        BEST_SCORE = score;

        save();
        GameMenu.updateHighScore( BEST_SCORE );
        }
    }


/**
 * Get the highest score from the local storage.
 */
function load()
    {
    var score = Utilities.getObject( 'bejeweled_high_score' );

    if ( score !== null )
        {
        BEST_SCORE = score;
        }
    }


/**
 * Save the current high score to the local storage.
 */
function save()
    {
    Utilities.saveObject( 'bejeweled_high_score', BEST_SCORE );
    }


/**
 * Reset the high score.
 */
export function clear()
    {
    BEST_SCORE = 0;

    save();
    GameMenu.updateHighScore( BEST_SCORE );
    }
}