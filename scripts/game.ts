module Game
{
var GRID: Grid | null;
var GRID_SIZE = 8;
var SELECTED: Gem | null = null;
var SCORE = 0;
var GAME_OVER = false;
var SELECT_SOUND: HTMLAudioElement;
var COMBINE_SOUND: HTMLAudioElement;


/**
 * Initialize the game related stuff.
 */
export function init()
    {
    G.CANVAS.width = GRID_SIZE * Gem.SIZE;
    G.CANVAS.height = GRID_SIZE * Gem.SIZE;

    SELECT_SOUND = new Audio( '../sounds/select.wav' );
    SELECT_SOUND.load();
    COMBINE_SOUND = new Audio( '../sounds/combine.wav' );
    COMBINE_SOUND.load();

    createjs.Ticker.on( 'tick', function( event )
        {
        G.STAGE.update();

        if ( GRID && !GAME_OVER )
            {
            GRID.tick();
            }
        });
    }


/**
 * Start a new game (new grid/reset score/etc).
 */
export function start()
    {
    GAME_OVER = false;
    SELECTED = null;
    GRID = new Grid( GRID_SIZE );

    GameMenu.startTimer( 30 );
    GameMenu.updateScore( SCORE );
    GameMenu.show();
    }


/**
 * When a gem is clicked, we either select it, or if there was a gem already selected we try to switch them.
 */
export function gemClicked( gem: Gem )
    {
        // no selection yet
    if ( SELECTED === null )
        {
        selectGem( gem );
        }

    else
        {
            // clicked the already selected gem, deselect
        if ( gem === SELECTED )
            {
            unselectGem();
            }

            // try to switch 2 gems
        else
            {
            if ( SELECTED.being_animated || gem.being_animated )
                {
                unselectGem();
                return;
                }

                // can only switch adjacent gems
            if ( GRID!.isValidSwitch( gem, SELECTED ) )
                {
                GRID!.switchGems( gem, SELECTED );
                unselectGem();
                }

            else
                {
                selectGem( gem );
                }
            }
        }
    }


/**
 * Select a gem (have a border around it).
 */
function selectGem( gem: Gem )
    {
    if ( SELECTED )
        {
            // clear the selection of previously selected gem
        SELECTED.setSelection( false );
        }

    SELECTED = gem;
    gem.setSelection( true );
    playSelectSound();
    }


/**
 * Unselect the current selected gem (if there is one).
 */
function unselectGem()
    {
    if ( SELECTED )
        {
        SELECTED.setSelection( false );
        }

    SELECTED = null;
    }


/**
 * Add to the current score.
 */
export function addToScore( score: number )
    {
    SCORE += score;

    GameMenu.updateScore( SCORE );
    }


/**
 * Get the current score.
 */
export function getScore()
    {
    return SCORE;
    }


/**
 * Clear the current game, and start a new one.
 */
export function restart()
    {
    GRID!.clear();
    GRID = null;

    SCORE = 0;
    Message.hide();

    Game.start();
    }


/**
 * Select a gem that can be combined (to help the player finding a possible move).
 */
export function help()
    {
    var gem = GRID!.isThereMoreValidMoves();

    if ( gem )
        {
        selectGem( gem );
        Game.addToScore( -50 );
        }
    }


/**
 * Game is over, add the score to the high-score and show an ending message.
 */
export function over( message: string )
    {
    GAME_OVER = true;

    var score = Game.getScore();
    HighScore.add( score );

    Message.show( message + '\nScore: ' + score, 2000, function()
        {
        Game.restart();
        });
    }


/**
 * When a gem is selected, play a sound.
 */
export function playSelectSound()
    {
    SELECT_SOUND.currentTime = 0;
    SELECT_SOUND.play();
    }


/**
 * When there's a gem combination, play a sound.
 */
export function playCombineSound()
    {
    COMBINE_SOUND.currentTime = 0;
    COMBINE_SOUND.play();
    }
}