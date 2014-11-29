enum GemType
    {
        green_gem,
        blue_gem,
        gray_gem,
        purple_gem,
        yellow_gem,
        red_gem,
        orange_gem
    }

class Gem
{
static _CONTAINER: createjs.Container;
static SIZE = 50;


static init( stage )
    {
    Gem._CONTAINER = new createjs.Container();

    stage.addChild( Gem._CONTAINER );
    }

shape: createjs.Container;
gem: createjs.Bitmap;
selection: createjs.Bitmap;
column: number;
line: number;
is_moving: boolean;
id: GemType;

constructor( id: GemType, column, line )
    {
    var _this = this;

    var shape = new createjs.Container();
    var gem = new createjs.Bitmap( G.PRELOAD.getResult( GemType[ id ] ) );
    var selection = new createjs.Bitmap( G.PRELOAD.getResult( 'gem_selected' ) );

    selection.visible = false;

        // define the area that triggers the click event
    var hitArea = new createjs.Shape();

    var g = hitArea.graphics;

    g.beginFill( 'black' ); // its not added to the display list
    g.drawRect( 0, 0, Gem.SIZE, Gem.SIZE );
    g.endFill();

    shape.hitArea = hitArea;
    shape.on( 'click', function()
        {
        if ( !_this.is_moving )
            {
            Game.gemClicked( _this );
            }
        });

    shape.addChild( selection );
    shape.addChild( gem );

    Gem._CONTAINER.addChild( shape );

    this.column = column;
    this.line = line;
    this.gem = gem;
    this.selection = selection;
    this.shape = shape;
    this.is_moving = false;
    this.id = id;
    }

positionIn( x, y )
    {
    this.shape.x = x;
    this.shape.y = y;
    }

moveTo( x, y )
    {
    var _this = this;
    this.is_moving = true;

    createjs.Tween.get( this.shape, { override: true } ).to({
            x: x,
            y: y
        }, 500 ).call( function()
        {
        _this.is_moving = false;
        });
    }

setSelection( value )
    {
    this.selection.visible = value;
    }

getX()
    {
    return this.shape.x;
    }

getY()
    {
    return this.shape.y;
    }

remove()
    {
    createjs.Tween.removeTweens( this.shape );

    Gem._CONTAINER.removeChild( this.shape );
    }
}