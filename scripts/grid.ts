interface GridAnimationQueue
    {
        action: GemAction;
        gems: {
            column: number;
            line: number;
            gem: Gem;
        }[]
    }

class Grid
{
grid: Gem[][];
size: number;
to_be_animated: GridAnimationQueue[];
animating: boolean;
clearing: boolean;


constructor( size: number )
    {
    this.grid = [];
    this.size = size;
    this.to_be_animated = [];
    this.animating = false;
    this.clearing = false;

    for (var column = 0 ; column < size ; column++)
        {
        this.grid[ column ] = [];

        for (var line = 0 ; line < size ; line++)
            {
            var gem = this.newRandomGem( column, line, true );

            this.grid[ column ][ line ] = gem;
            }
        }

    this.clearChains();
    }


newRandomGem( column: number, line: number, positionGem: boolean )
    {
    var gemType = Utilities.getRandomInt( 0, Gem.TYPE_COUNT - 1 );

    var gem = new Gem( gemType );

    if ( positionGem === true )
        {
        gem.positionIn( column, line );
        }

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

switchGems( gem1, gem2 )
    {
        // get the gem position before moving it (so we can then move the selected gem to this position)
    var gem1_column = gem1.column;
    var gem1_line = gem1.line;

    var gem2_column = gem2.column;
    var gem2_line = gem2.line;

        // switch the gems, and check if it leads to a chain
    gem1.column = gem2_column;
    gem1.line = gem2_line;

    gem2.column = gem1_column;
    gem2.line = gem1_line;

    this.grid[ gem1_column ][ gem1_line ] = gem2;
    this.grid[ gem2_column ][ gem2_line ] = gem1;

    this.addToAnimationQueue({
        action: GemAction.move,
        gems: [
            { gem: gem1, column: gem2_column, line: gem2_line },
            { gem: gem2, column: gem1_column, line: gem1_line }
        ]
    });

        // if it doesn't lead to a chain, we need to move it back
    if ( this.checkHorizontalChain( gem1_column, gem1_line ) === null &&
         this.checkVerticalChain( gem1_column, gem1_line ) === null &&
         this.checkHorizontalChain( gem2_column, gem2_line ) === null &&
         this.checkVerticalChain( gem2_column, gem2_line ) === null )
        {
        gem1.column = gem1_column;
        gem1.line = gem1_line;

        gem2.column = gem2_column;
        gem2.line = gem2_line;

        this.grid[ gem1_column ][ gem1_line ] = gem1;
        this.grid[ gem2_column ][ gem2_line ] = gem2;

        this.addToAnimationQueue({
            action: GemAction.move,
            gems: [
                    { gem: gem1, column: gem1_column, line: gem1_line },
                    { gem: gem2, column: gem2_column, line: gem2_line }
                ]
            });
        }
    }


removeGem( column, line, callback?: () => any )
    {
    var _this = this;
    var gem = this.grid[ column ][ line ];

        // update the grid first, and not at the end of the animation (so that we can queue more actions, based on the end result)
    _this.grid[ column ][ line ] = null;

    if ( gem !== null )
        {
        gem.remove( callback );
        }
    }



moveGem( gem, column, line, callback?: () => any )
    {
    var _this = this;

    _this.grid[ column ][ line ] = gem;

    gem.moveTo( column, line, callback );
    }



clearChains(): boolean
    {
    if ( this.clearing )
        {
        return false;
        }

    var aChainCleared = this.checkForChains();

    if ( !aChainCleared )
        {
        if ( !this.reAddGems() )
            {
            if ( !this.isThereMoreValidMoves() )
                {
                var score = Game.getScore();

                Message.show( 'No more valid moves!\nScore: ' + score, 2000, function()
                    {
                    Game.restart();
                    });
                }
            }
        }

    return aChainCleared;
    }


clearGemFlags()
    {
    var size = this.size;

    for (var column = 0 ; column < size ; column++)
        {
        for (var line = 0 ; line < size ; line++)
            {
            var gem = this.grid[ column ][ line ];

            if ( gem )
                {
                gem.already_checked_horizontal = false;
                gem.already_checked_vertical = false;
                }
            }
        }
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
    var info = {
            action: GemAction.remove,
            gems: []
        };

    var removeChain = function( endColumn, endLine, count, vertical: boolean )
        {
        if ( vertical === true )
            {
            for (var line = endLine ; line > endLine - count ; line--)
                {
                info.gems.push({
                        column: endColumn,
                        line: line,
                        gem: grid[ endColumn ][ line ]
                    });
                }
            }

        else
            {
            for (var column = endColumn ; column > endColumn - count ; column--)
                {
                info.gems.push({
                        column: column,
                        line: endLine,
                        gem: grid[ column ][ endLine ]
                    });
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

            var horizontalChains = [];
            var verticalChains = [];

                // search for gem chains
                // uses a flood fill algorithm, to determine the connected chains (of the same id as the starting gem)
                // we have two flags for horizontal and vertical orientation, to know if we already checked the gem
            var check = function( gem, id )
                {
                if ( !gem ||
                     gem.id !== id ||
                     gem.already_checked_horizontal && gem.already_checked_vertical )
                    {
                    return;
                    }

                if ( !gem.already_checked_horizontal )
                    {
                    var chain = _this.checkHorizontalChain( gem.column, gem.line );
                    if ( chain !== null )
                        {
                        horizontalChains.push( chain );
                        }

                    gem.already_checked_horizontal = true;
                    }

                if ( !gem.already_checked_vertical )
                    {
                    chain = _this.checkVerticalChain( gem.column, gem.line );
                    if ( chain !== null )
                        {
                        verticalChains.push( chain );
                        }

                    gem.already_checked_vertical = true;
                    }

                var adjacents = _this.getAdjacentGems( gem.column, gem.line );

                for (var a = 0 ; a < adjacents.length ; a++)
                    {
                    check( adjacents[ a ], id );
                    }
                };

            check( referenceGem, referenceGem.id );

            for (var a = 0 ; a < horizontalChains.length ; a++)
                {
                foundChains = true;

                var chain = horizontalChains[ a ];
                removeChain( chain.column + chain.size - 1, chain.line, chain.size, false );
                }

            for (var a = 0 ; a < verticalChains.length ; a++)
                {
                foundChains = true;

                var chain = verticalChains[ a ];
                removeChain( chain.column, chain.line + chain.size - 1, chain.size, true );
                }
            }
        }


    if ( info.gems.length > 0 )
        {
        _this.addToAnimationQueue( info );
        }

    this.clearGemFlags();

    return foundChains;
    }


checkHorizontalChain( column, line )
    {
    var size = this.size;
    var grid = this.grid;
    var countLeft = 0;
    var countRight = 0;
    var referenceGem = grid[ column ][ line ];
    var a;
    var gem;

        // count to the right
    for (a = column + 1 ; a < size ; a++)
        {
        gem = grid[ a ][ line ];

        if ( gem && gem.id === referenceGem.id )
            {
            gem.already_checked_horizontal = true;
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
        gem = grid[ a ][ line ];

        if ( gem && gem.id === referenceGem.id )
            {
            gem.already_checked_horizontal = true;
            countLeft++;
            }

        else
            {
            break;
            }
        }

    var count = countLeft + countRight + 1;

    if ( count >= 3 )
        {
        return {
                line: line,
                column: column - countLeft,
                size: count
            }
        }

    else
        {
        return null;
        }
    }

checkVerticalChain( column, line )
    {
    var size = this.size;
    var grid = this.grid;
    var countUp = 0;
    var countDown = 0;
    var referenceGem = this.grid[ column ][ line ];
    var a;
    var gem;

        // count up
    for (a = line - 1 ; a >= 0 ; a--)
        {
        gem = grid[ column ][ a ];

        if ( gem && gem.id === referenceGem.id )
            {
            gem.already_checked_vertical = true;
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
        gem = grid[ column ][ a ];

        if ( gem && gem.id === referenceGem.id )
            {
            gem.already_checked_vertical = true;
            countDown++;
            }

        else
            {
            break;
            }
        }

    var count = countDown + countUp + 1;

    if ( count >= 3 )
        {
        return {
                line: line - countUp,
                column: column,
                size: count
            }
        }

    else
        {
        return null;
        }
    }


/*
    Existing gems fall down (so that all the gaps are on top), and then add new gems on top.
 */

reAddGems(): boolean
    {
    var size = this.size;
    var gem: Gem;
    var line;
    var info = {
            action: GemAction.move,
            gems: []
        };

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
        var gapCount = 0;

            // move all the gems to the bottom (all the gaps on top)
        for (line = size - 1 ; line >= 0 ; line--)
            {
            gem = gems[ line - gemDiff ];

            if ( gem )
                {
                if ( gem.column !== column || gem.line !== line )
                    {
                    info.gems.push({
                            gem: gem,
                            column: column,
                            line: line
                        });

                    this.grid[ column ][ line ] = gem;
                    }

                }

            else
                {
                gapCount++;
                this.grid[ column ][ line ] = null;
                }
            }


            // re-add new random gems
        for (line = 0 ; line < size ; line++)
            {
            if ( this.grid[ column ][ line ] === null )
                {
                gem = this.newRandomGem( column, line, false );

                gem.positionIn( column, -(gapCount - line) );
                info.gems.push({
                        gem: gem,
                        column: column,
                        line: line
                    });
                }

            else
                {
                break;
                }
            }
        }

    if ( info.gems.length > 0 )
        {
        this.addToAnimationQueue( info );
        return true;
        }

    return false;
    }


getAdjacentGems( column, line )
    {
    var adjacentGems = [];

    if ( column > 0 )
        {
        adjacentGems.push( this.grid[ column - 1 ][ line ] );
        }

    if ( column < this.size - 1 )
        {
        adjacentGems.push( this.grid[ column + 1 ][ line ] );
        }

    if ( line > 0 )
        {
        adjacentGems.push( this.grid[ column ][ line - 1 ] );
        }

    if ( line < this.size - 1 )
        {
        adjacentGems.push( this.grid[ column ][ line + 1 ] );
        }

    return adjacentGems;
    }


/*
    Receives some gems, that are going to be animated when once all the other gems in the queue are dealt with
 */

addToAnimationQueue( info: GridAnimationQueue )
    {
    this.to_be_animated.push( info );

    for (var a = 0, length = info.gems.length ; a < length ; a++)
        {
        info.gems[ a ].gem.being_worked_on = true;
        }

    this.startAnimations();
    }

/*
    Start the next batch of animations
 */

startAnimations()
    {
    if ( this.animating )
        {
        return;
        }

    if ( this.to_be_animated.length === 0 )
        {
        this.clearChains();
        return;
        }

    var _this = this;
    this.animating = true;

    var info = this.to_be_animated.shift();

    if ( info.action === GemAction.move )
        {
        for (var a = 1 ; a < info.gems.length ; a++)
            {
            var gemInfo = info.gems[ a ];

            _this.moveGem( gemInfo.gem, gemInfo.column, gemInfo.line );
            }

        var first = info.gems[ 0 ];

        _this.moveGem( first.gem, first.column, first.line, function()
            {
            _this.animating = false;
            _this.startAnimations();
            });
        }

    else if ( info.action === GemAction.remove )
        {
        var gemChain = info.gems.length;

        Game.addToScore( gemChain * 10 );
        GameMenu.addToTimer( gemChain );

        for (var a = 1 ; a < info.gems.length ; a++)
            {
            var gemInfo = info.gems[ a ];

            _this.removeGem( gemInfo.column, gemInfo.line );
            }

        var first = info.gems[ 0 ];

        _this.removeGem( first.column, first.line, function()
            {
            _this.animating = false;
            _this.startAnimations();
            })
        }
    }


static toCanvasPosition( column, line )
    {
    return {
            x: column * Gem.SIZE + Gem.SIZE / 2,
            y: line   * Gem.SIZE + Gem.SIZE / 2
        };
    }

/*
    Cases where there's still a valid gem chain
    (the _x is the reference gem)

    _x xx | _xx x |    x | _xx  | _x   |   xx | _x x |   x
          |       | _xx  |    x |   xx | _x   |   x  | _x x

    _x | _x | _x  |  _x | _x  |  _x | _x  |  _x
     x |    |  x  |   x |   x |  x  |   x |  x
       |  x |   x |  x  |   x |  x  |  x  |   x
     x |  x |     |     |     |     |     |
 */

isThereMoreValidMoves(): boolean
    {
    var moves = [   //HERE make this static
            [
                { columnOffset: 2, lineOffset: 0 },
                { columnOffset: 3, lineOffset: 0 }
            ],
            [
                { columnOffset: 1, lineOffset: 0 },
                { columnOffset: 3, lineOffset: 0 }
            ],
            [
                { columnOffset: 1, lineOffset: 0 },
                { columnOffset: 2, lineOffset: -1 }
            ],
            [
                { columnOffset: 1, lineOffset: 0 },
                { columnOffset: 2, lineOffset: 1 }
            ],
            [
                { columnOffset: 1, lineOffset: 1 },
                { columnOffset: 2, lineOffset: 1 }
            ],
            [
                { columnOffset: 1, lineOffset: -1 },
                { columnOffset: 2, lineOffset: -1 }
            ],
            [
                { columnOffset: 1, lineOffset: 1 },
                { columnOffset: 2, lineOffset: 0 }
            ],
            [
                { columnOffset: 1, lineOffset: -1 },
                { columnOffset: 2, lineOffset: 0 }
            ],
            [
                { columnOffset: 0, lineOffset: 1 },
                { columnOffset: 0, lineOffset: 3 }
            ],
            [
                { columnOffset: 0, lineOffset: 2 },
                { columnOffset: 0, lineOffset: 3 }
            ],
            [
                { columnOffset: 0, lineOffset: 1 },
                { columnOffset: 1, lineOffset: 2 }
            ],
            [
                { columnOffset: 0, lineOffset: 1 },
                { columnOffset: -1, lineOffset: 2 }
            ],
            [
                { columnOffset: 1, lineOffset: 1 },
                { columnOffset: 1, lineOffset: 2 }
            ],
            [
                { columnOffset: -1, lineOffset: 1 },
                { columnOffset: -1, lineOffset: 2 }
            ],
            [
                { columnOffset: 1, lineOffset: 1 },
                { columnOffset: 0, lineOffset: 2 }
            ],
            [
                { columnOffset: -1, lineOffset: 1 },
                { columnOffset: 0, lineOffset: 2 }
            ]
        ];
        
        // loop here over the moves, for each gem
    var size = this.size;
    var grid = this.grid;
    var movesSize = moves.length;

    for (var column = 0 ; column < size ; column++)
        {
        for (var line = 0 ; line < size ; line++)
            {
            var gem = grid[ column ][ line ];
            var gemId = gem.id;

            for (var a = 0 ; a < movesSize ; a++)
                {
                var move = moves[ a ];
                var one = move[ 0 ];
                var two = move[ 1 ];
                var oneColumn = column + one.columnOffset;
                var oneLine = line + one.lineOffset;
                var twoColumn = column + two.columnOffset;
                var twoLine = line + two.lineOffset;


                if ( (grid[ oneColumn ] && grid[ oneColumn ][ oneLine ] && grid[ oneColumn ][ oneLine ].id === gemId) &&
                     (grid[ twoColumn ] && grid[ twoColumn ][ twoLine ] && grid[ twoColumn ][ twoLine ].id === gemId) )
                    {
                    return true;
                    }
                }
            }
        }

    return false;
    }


clear()
    {
    this.clearing = true;

    Gem._CONTAINER.removeAllChildren();
    }
}
