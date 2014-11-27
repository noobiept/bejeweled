class Grid
{
grid;

constructor( size: number, gemsId: string[] )
    {
    this.grid = [];

    for (var column = 0 ; column < size ; column++)
        {
        this.grid[ column ] = [];

        for (var line = 0 ; line < size ; line++)
            {
            var position = Utilities.getRandomInt( 0, gemsId.length - 1 );

            var gem = new Gem( gemsId[ position ], column, line );

            gem.positionIn( column * Gem.SIZE, line * Gem.SIZE );

            this.grid[ column ][ line ] = gem;
            }
        }
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

switchGems( gem1, gem2 )
    {
        // get the gem position before moving it (so we can then move the selected gem to this position)
    var gem1_column = gem1.column;
    var gem1_line = gem1.line;

    var gem2_column = gem2.column;
    var gem2_line = gem2.line;

    gem1.moveTo( gem2_column * Gem.SIZE, gem2_line * Gem.SIZE );
    gem2.moveTo( gem1_column * Gem.SIZE, gem1_line * Gem.SIZE );

    gem1.column = gem2_column;
    gem1.line = gem2_line;

    gem2.column = gem1_column;
    gem2.line = gem1_line;

    this.grid[ gem1_column ][ gem1_line ] = gem2;
    this.grid[ gem2_column ][ gem2_line ] = gem1;
    }
}