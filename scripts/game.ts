module Game
{
var GRID: Grid | null;
var SELECTED: Gem | null = null;
var SCORE = 0;
var GRID_SIZE = 8;
var GAME_OVER = false;
var SELECT_SOUND: HTMLAudioElement;
var COMBINE_SOUND: HTMLAudioElement;


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


export function start()
    {
    GAME_OVER = false;
    SELECTED = null;
    GRID = new Grid( GRID_SIZE );

    GameMenu.startTimer( 30 );
    GameMenu.updateScore( SCORE );
    GameMenu.show();
    }


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


function unselectGem()
    {
    if ( SELECTED )
        {
        SELECTED.setSelection( false );
        }

    SELECTED = null;
    }


export function addToScore( score: number )
    {
    SCORE += score;

    GameMenu.updateScore( SCORE );
    }


export function getScore()
    {
    return SCORE;
    }


export function restart()
    {
    GRID!.clear();
    GRID = null;

    SCORE = 0;
    Message.hide();

    Game.start();
    }


export function help()
    {
    var gem = GRID!.isThereMoreValidMoves();

    selectGem( gem! );
    }


export function over()
    {
    GAME_OVER = true;

    var score = Game.getScore();
    HighScore.add( score );

    Message.show( 'No more valid moves!\nScore: ' + score, 2000, function()
        {
        Game.restart();
        });
    }


export function playSelectSound()
    {
    SELECT_SOUND.currentTime = 0;
    SELECT_SOUND.play();
    }


export function playCombineSound()
    {
    COMBINE_SOUND.currentTime = 0;
    COMBINE_SOUND.play();
    }
}