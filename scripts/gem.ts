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

enum GemAction
    {
        move,
        remove
    }



class Gem
{
static _CONTAINER: createjs.Container;
static SIZE = 50;
static MOVEMENT_SPEED = 300;

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
already_checked_horizontal: boolean;
already_checked_vertical: boolean;
being_worked_on: boolean;

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

    shape.regX = Gem.SIZE / 2;
    shape.regY = Gem.SIZE / 2;
    shape.hitArea = hitArea;
    shape.on( 'click', function()
        {
        if ( !_this.is_moving && !_this.being_worked_on )
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
    this.already_checked_horizontal = false;
    this.already_checked_vertical = false;
    this.being_worked_on = false;
    }

positionIn( column, line )
    {
    this.column = column;
    this.line = line;

    var canvasPosition = Grid.toCanvasPosition( column, line );

    this.shape.x = canvasPosition.x;
    this.shape.y = canvasPosition.y;
    }


moveTo( column, line, callback?: () => any )
    {
    var _this = this;

    var canvasPosition = Grid.toCanvasPosition( column, line );
    var distanceY = Math.abs( this.line - line ) * Gem.SIZE;
    var distanceX = Math.abs( this.column - column ) * Gem.SIZE;
    var distance;

        // moving up/down
        // can only move horizontally or vertically
    if ( distanceY > distanceX )
        {
        distance = distanceY;
        }

        // moving left/right
    else
        {
        distance = distanceX;
        }

    if ( distance < Gem.SIZE )
        {
        distance = Gem.SIZE;
        }


    this.is_moving = true;
    this.column = column;
    this.line = line;

    var duration = distance / Gem.MOVEMENT_SPEED * 1000;

    createjs.Tween.get( this.shape, { override: true } ).to({
            x: canvasPosition.x,
            y: canvasPosition.y
        }, duration ).call( function()
        {
        _this.is_moving = false;
        _this.being_worked_on = false;

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

remove( callback?: () => any )
    {
    var _this = this;

    createjs.Tween.get( this.shape ).to(
        {
            scaleX: 0,
            scaleY: 0
        }, 400 ).call( function()
            {
            Gem._CONTAINER.removeChild( _this.shape );

            if ( callback )
                {
                callback();
                }
            });
    }
}