module HighScore
{
var BEST_SCORE: number;

export function init()
    {
    BEST_SCORE = 0;

    load();
    GameMenu.updateHighScore( BEST_SCORE );
    }


export function add( score: number )
    {
    if ( score > BEST_SCORE )
        {
        BEST_SCORE = score;

        save();
        GameMenu.updateHighScore( BEST_SCORE );
        }
    }


function load()
    {
    var score = Utilities.getObject( 'bejeweled_high_score' );

    if ( score !== null )
        {
        BEST_SCORE = score;
        }
    }


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