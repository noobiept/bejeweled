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

    //Game.checkForChains();
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

                //HERE - check if it leads to a 3+ chain of same type/color gem
                }

            else
                {
                SELECTED = gem;

                gem.setSelection( true );
                }
            }
        }
    }


/*
    Checks for gem chains (3+ gems in horizontal/vertical line), and clears them
 */

export function checkForChains()
    {
    var grid = GRID.grid;
    var size = GRID.size;

    var removeChain = function( endColumn, endLine, count, vertical: boolean )
        {
        if ( vertical === true )
            {
            for (var line = endLine ; line > endLine - count ; line--)
                {
                GRID.removeGem( endColumn, line );
                }
            }

        else
            {
            for (var column = endColumn ; column > endColumn - count ; column--)
                {
                GRID.removeGem( column, endLine );
                }
            }
        };


    for (var column = 0 ; column < size ; column++)
        {
        for (var line = 0 ; line < size ; line++)
            {
            var referenceGem = grid[ column ][ line ];

            if ( referenceGem === null )
                {
                continue;
                }

            var countLeft = 0;
            var countRight = 0;
            var countUp = 0;
            var countDown = 0;
            var tempGem;
            var a;

                // count to the right
            for (a = column + 1 ; a < size ; a++)
                {
                tempGem = grid[ a ][ line ];

                if ( tempGem && tempGem.id === referenceGem.id )
                    {
                    countRight++;
                    }

                else
                    {
                    break;
                    }
                }

                // count to the left
            for (a = column - 1 ; a >= 0 ; a--)
                {
                tempGem = grid[ a ][ line ];

                if ( tempGem && tempGem.id === referenceGem.id )
                    {
                    countLeft++;
                    }

                else
                    {
                    break;
                    }
                }

                // count up
            for (a = line - 1 ; a >= 0 ; a--)
                {
                tempGem = grid[ column ][ a ];

                if ( tempGem && tempGem.id === referenceGem.id )
                    {
                    countUp++;
                    }

                else
                    {
                    break;
                    }
                }

                // count down
            for (a = line + 1 ; a < size ; a++)
                {
                tempGem = grid[ column ][ a ];

                if ( tempGem && tempGem.id === referenceGem.id )
                    {
                    countDown++;
                    }

                else
                    {
                    break;
                    }
                }

            var horizontalCount = countLeft + countRight + 1;
            var verticalCount = countUp + countDown + 1;

            if ( horizontalCount >= 3 )
                {
                removeChain( column + countRight, line, horizontalCount, false );
                }

            if ( verticalCount >= 3 )
                {
                removeChain( column, line + countDown, verticalCount, true );
                }
            }
        }
    }
}