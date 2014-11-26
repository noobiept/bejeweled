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


areGemsAdjacent( gem1, gem2 )
    {
    var gem1_column = gem1.column;
    var gem1_line = gem1.line;

    var gem2_column = gem2.column;
    var gem2_line = gem2.line;

    if ( gem1_column > gem2_column + 1 ||
         gem1_column < gem2_column - 1 ||
         gem1_line > gem2_line + 1 ||
         gem1_line < gem2_line - 1 )
        {
        return false;
        }

    return true;
    }

switchGems( gem1, gem2 )
    {
        // get the gem position before moving it (so we can then move the selected gem to this position)
    var gem1_x = gem1.getX();
    var gem1_y = gem1.getY();
    var gem1_column = gem1.column;
    var gem1_line = gem1.line;

    var gem2_column = gem2.column;
    var gem2_line = gem2.line;

    gem1.moveTo( gem2.getX(), gem2.getY() );
    gem2.moveTo( gem1_x, gem1_y );

    gem1.column = gem2_column;
    gem1.line = gem2_line;

    gem2.column = gem1_column;
    gem2.line = gem1_line;

    this.grid[ gem1_column ][ gem1_line ] = gem2;
    this.grid[ gem2_column ][ gem2_line ] = gem1;
    }
}