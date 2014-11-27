module Game
{
var GRID: Grid;
var SELECTED: Gem = null;
var TYPES_OF_GEMS = [ 'green_gem', 'blue_gem', 'gray_gem', 'purple_gem', 'yellow_gem', 'red_gem', 'orange_gem' ];

export function start()
    {
    GRID = new Grid( 8, TYPES_OF_GEMS );


    createjs.Ticker.on( 'tick', function( event )
        {
        G.STAGE.update();
        });
    }


export function gemClicked( gem: Gem )
    {
        // no selection yet
    if ( SELECTED === null )
        {
        SELECTED = gem;

        gem.setSelection( true );
        }

    else
        {
            // clear the selection of previously selected gem
        SELECTED.setSelection( false );

            // clicked the already selected gem, deselect
        if ( gem === SELECTED )
            {
            SELECTED = null;
            }

            // try to switch 2 gems
        else
            {
                // can only switch adjacent gems
            if ( GRID.isValidSwitch( gem, SELECTED ) )
                {
                GRID.switchGems( gem, SELECTED );
                SELECTED = null;
                }

            else
                {
                SELECTED = gem;

                gem.setSelection( true );
                }
            }
        }
    }
}