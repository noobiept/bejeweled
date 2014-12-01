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

    // GemType is a enum, which will have as key the gem's id, plus the associated position (so we need to divide by 2)
static TYPE_COUNT = Object.keys( GemType ).length / 2;


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

constructor( id: GemType )
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

    this.column = -1;   // need to call positionIn() or moveTo() to position the gem
    this.line = -1;
    this.gem = gem;
    this.selection = selection;
    this.shape = shape;
    this.is_moving = false;
    this.id = id;
    }

positionIn( column, line )
    {
    this.column = column;
    this.line = line;

    this.shape.x = column * Gem.SIZE;
    this.shape.y = line * Gem.SIZE;
    }


moveTo( column, line, callback?: () => any )
    {
    var _this = this;
    this.is_moving = true;
    var x = column * Gem.SIZE;
    var y = line * Gem.SIZE;

    this.column = column;
    this.line = line;

    createjs.Tween.get( this.shape, { override: true } ).to({
            x: x,
            y: y
        }, 500 ).call( function()
        {
        _this.is_moving = false;

        if ( callback )
            {
            callback();
            }
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