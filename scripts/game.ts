module Game
{
var GRID: Grid;
var SELECTED: Gem = null;


export function start()
    {
    GRID = new Grid( 8 );


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