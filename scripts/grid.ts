class Grid
{
grid;

constructor( size )
    {
    this.grid = [];

    for (var column = 0 ; column < size ; column++)
        {
        this.grid[ column ] = [];

        for (var line = 0 ; line < size ; line++)
            {
            var gem = new Gem( 'blue_gem' );

            gem.positionIn( column * Gem.SIZE, line * Gem.SIZE );

            this.grid[ column ][ line ] = gem;
            }
        }
    }
}