class Grid
{
grid: Gem[][];
size: number;

constructor( size: number )
    {
    this.grid = [];
    this.size = size;

    for (var column = 0 ; column < size ; column++)
        {
        this.grid[ column ] = [];

        for (var line = 0 ; line < size ; line++)
            {
            this.newRandomGem( column, line, true );
            }
        }
    }


newRandomGem( column: number, line: number, positionGem: boolean )
    {
    var gemType = Utilities.getRandomInt( 0, Gem.TYPE_COUNT - 1 );

    var gem = new Gem( gemType );

    if ( positionGem === true )
        {
        gem.positionIn( column, line );
        }

    this.grid[ column ][ line ] = gem;

    return gem;
    }


/*
    You can only switch 2 gems if they're adjacent with each other, and with a horizontal/vertical orientation
 */

isValidSwitch( gem1, gem2 )
    {
    var columnDiff = Math.abs( gem1.column - gem2.column );
    var lineDiff = Math.abs( gem1.line - gem2.line );

    if ( (columnDiff === 0 && lineDiff === 1) ||
         (lineDiff === 0 && columnDiff === 1) )
        {
        return true;
        }

    return false;
    }

switchGems( gem1, gem2, checkIfValid= true )
    {
    var _this = this;

        // get the gem position before moving it (so we can then move the selected gem to this position)
    var gem1_column = gem1.column;
    var gem1_line = gem1.line;

    var gem2_column = gem2.column;
    var gem2_line = gem2.line;

    gem1.moveTo( gem2_column, gem2_line );
    gem2.moveTo( gem1_column, gem1_line, function()
        {
        if ( checkIfValid )
            {
                // if a chain wasn't cleared, means we need to move undo the switch
            if ( !_this.clearChains() )
                {
                _this.switchGems( gem1, gem2, false );
                }
            }

        });

    gem1.column = gem2_column;
    gem1.line = gem2_line;

    gem2.column = gem1_column;
    gem2.line = gem1_line;

    this.grid[ gem1_column ][ gem1_line ] = gem2;
    this.grid[ gem2_column ][ gem2_line ] = gem1;
    }


removeGem( column, line )
    {
    var gem = this.grid[ column ][ line ];

    if ( gem !== null )
        {
        gem.remove();

        this.grid[ column ][ line ] = null;
        }
    }


clearChains(): boolean
    {
    var aChainCleared = false;

    while( this.checkForChains() )
        {
        aChainCleared = true;
        this.reAddGems();
        }

    return aChainCleared;
    }



/*
    Checks for gem chains (3+ gems in horizontal/vertical line), and clears them
 */

checkForChains(): boolean
    {
    var _this = this;
    var grid = this.grid;
    var size = this.size;
    var foundChains = false;

    var removeChain = function( endColumn, endLine, count, vertical: boolean )
        {
        if ( vertical === true )
            {
            for (var line = endLine ; line > endLine - count ; line--)
                {
                _this.removeGem( endColumn, line );
                }
            }

        else
            {
            for (var column = endColumn ; column > endColumn - count ; column--)
                {
                _this.removeGem( column, endLine );
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

                foundChains = true;
                }

            if ( verticalCount >= 3 )
                {
                removeChain( column, line + countDown, verticalCount, true );

                foundChains = true;
                }
            }
        }

    return foundChains;
    }



/*
    Existing gems fall down (so that all the gaps are on top), and then add new gems on top.
 */

reAddGems()
    {
    var size = this.size;
    var gem: Gem;
    var line;

    for (var column = 0 ; column < size ; column++)
        {
        var gems = [];

            // get all the gems in this column
        for (line = 0 ; line < size ; line++)
            {
            gem = this.grid[ column ][ line ];

            if ( gem !== null )
                {
                gems.push( gem );
                }
            }

        var gemDiff = size - gems.length;

            // move all the gems to the bottom (all the gaps on top)
        for (line = size - 1 ; line >= 0 ; line--)
            {
            gem = gems[ line - gemDiff ];

            if ( gem )
                {
                gem.moveTo( column, line );

                this.grid[ column ][ line ] = gem;
                }

            else
                {
                this.grid[ column ][ line ] = null;
                }
            }


            // re-add new random gems
        for (line = 0 ; line < size ; line++)
            {
            if ( this.grid[ column ][ line ] === null )
                {
                gem = this.newRandomGem( column, line, false );

                gem.positionIn( column, -(line + 1) );
                gem.moveTo( column, line );
                }

            else
                {
                break;
                }
            }
        }
    }
}