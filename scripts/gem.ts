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
static MOVEMENT_SPEED = 500;

    // GemType is a enum, which will have as key the gem's id, plus the associated position (so we need to divide by 2)
static TYPE_COUNT = Object.keys( GemType ).length / 2;


static init( stage: createjs.Stage )
    {
    Gem._CONTAINER = new createjs.Container();

    stage.addChild( Gem._CONTAINER );
    }

shape: createjs.Container;
gem: createjs.Bitmap;
selection: createjs.Bitmap;
column: number;
line: number;
id: GemType;
already_checked_horizontal = false;
already_checked_vertical = false;
being_animated = false;


constructor( id: GemType )
    {
    var _this = this;

    var shape = new createjs.Container();
    var gem = new createjs.Bitmap( <HTMLImageElement> G.PRELOAD.getResult( GemType[ id ] ) );
    var selection = new createjs.Bitmap( <HTMLImageElement> G.PRELOAD.getResult( 'gem_selected' ) );

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
        if ( !_this.being_animated )
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
    this.id = id;
    }


positionIn( column: number, line: number )
    {
    this.column = column;
    this.line = line;

    var canvasPosition = Grid.toCanvasPosition( column, line );

    this.shape.x = canvasPosition.x;
    this.shape.y = canvasPosition.y;
    }


moveTo( column: number, line: number, callback?: () => any )
    {
    var _this = this;

    var canvasPosition = Grid.toCanvasPosition( column, line );
    var distanceY = Math.abs( this.line - line ) * Gem.SIZE;
    var distanceX = Math.abs( this.column - column ) * Gem.SIZE;
    var distance: number;

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

    this.being_animated = true;

    var duration = distance / Gem.MOVEMENT_SPEED * 1000;

    createjs.Tween.get( this.shape, { override: true } ).to({
            x: canvasPosition.x,
            y: canvasPosition.y
        }, duration ).call( function()
        {
        _this.being_animated = false;
        _this.column = column;
        _this.line = line;

        if ( callback )
            {
            callback();
            }
        });
    }


setSelection( value: boolean )
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
    this.being_animated = true;

    createjs.Tween.get( this.shape ).to(
        {
            scaleX: 0,
            scaleY: 0
        }, 300 ).call( function()
            {
            Gem._CONTAINER.removeChild( _this.shape );
            _this.being_animated = false;

            if ( callback )
                {
                callback();
                }
            });
    }
}