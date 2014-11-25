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

constructor( id )
    {
    var shape = new createjs.Bitmap( G.PRELOAD.getResult( id ) );

    Gem._CONTAINER.addChild( shape );

    this.shape = shape;
    }

positionIn( x, y )
    {
    this.shape.x = x;
    this.shape.y = y;
    }
}