class Gem
{
static _CONTAINER: createjs.Container;
static SIZE = 50;

static init( stage )
    {
    Gem._CONTAINER = new createjs.Container();

    stage.addChild( Gem._CONTAINER );
    }

shape: createjs.Bitmap;
column: number;
line: number;

constructor( id, column, line )
    {
    var _this = this;

    var shape = new createjs.Bitmap( G.PRELOAD.getResult( id ) );

    shape.on( 'click', function()
        {
        Game.gemClicked( _this );
        });

    Gem._CONTAINER.addChild( shape );

    this.column = column;
    this.line = line;
    this.shape = shape;
    }

positionIn( x, y )
    {
    this.shape.x = x;
    this.shape.y = y;
    }

moveTo( x, y )
    {
    this.positionIn( x, y );    //HERE
    }

setSelection( value )
    {

    }

getX()
    {
    return this.shape.x;
    }

getY()
    {
    return this.shape.y;
    }
}