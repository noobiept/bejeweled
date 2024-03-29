var Grid = (function () {
    function Grid(size) {
        this.animated_count = 0;
        this.grid = [];
        this.size = size;
        this.clearing = false;
        for (var column = 0; column < size; column++) {
            this.grid[column] = [];
            for (var line = 0; line < size; line++) {
                var gem = this.newRandomGem(column, line);
                this.grid[column][line] = gem;
            }
        }
    }
    /**
     * Add a random gem to the given position.
     */
    Grid.prototype.newRandomGem = function (column, line) {
        var gemType = Utilities.getRandomInt(0, Gem.TYPE_COUNT - 1);
        var gem = new Gem(gemType);
        gem.positionIn(column, line);
        return gem;
    };
    /**
     * Check if you can switch the given gems. You can only switch 2 gems if they're adjacent with each other, and with a horizontal/vertical orientation.
     */
    Grid.prototype.isValidSwitch = function (gem1, gem2) {
        var columnDiff = Math.abs(gem1.column - gem2.column);
        var lineDiff = Math.abs(gem1.line - gem2.line);
        if ((columnDiff === 0 && lineDiff === 1) ||
            (lineDiff === 0 && columnDiff === 1)) {
            return true;
        }
        return false;
    };
    /**
     * Try to switch the given gems. If its not possible, then the gems will switch back to the original position.
     */
    Grid.prototype.switchGems = function (gem1, gem2) {
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
        var _this = this;
        this.grid[gem1_column][gem1_line] = gem2;
        this.grid[gem2_column][gem2_line] = gem1;
        this.animated_count++;
        gem1.moveTo(gem2_column, gem2_line);
        gem2.moveTo(gem1_column, gem1_line, function () {
            // if it doesn't lead to a chain, we need to move it back
            if (_this.checkHorizontalChain(gem1_column, gem1_line) === null &&
                _this.checkVerticalChain(gem1_column, gem1_line) === null &&
                _this.checkHorizontalChain(gem2_column, gem2_line) === null &&
                _this.checkVerticalChain(gem2_column, gem2_line) === null) {
                gem1.column = gem1_column;
                gem1.line = gem1_line;
                gem2.column = gem2_column;
                gem2.line = gem2_line;
                _this.grid[gem1_column][gem1_line] = gem1;
                _this.grid[gem2_column][gem2_line] = gem2;
                gem1.moveTo(gem1_column, gem1_line);
                gem2.moveTo(gem2_column, gem2_line, function () {
                    _this.animated_count--;
                });
            }
            else {
                _this.animated_count--;
            }
        });
    };
    /**
     * Remove a gem from the grid.
     */
    Grid.prototype.removeGem = function (column, line, callback) {
        var _this = this;
        var gem = this.grid[column][line];
        this.animated_count++;
        if (gem !== null) {
            gem.remove(function () {
                _this.grid[column][line] = null;
                _this.animated_count--;
            });
        }
    };
    /**
     * Move a gem to a new position.
     */
    Grid.prototype.moveGem = function (gem, column, line, callback) {
        if (column < 0 || column >= this.size ||
            line < 0 || line >= this.size) {
            return;
        }
        var _this = this;
        var previousColumn = gem.column;
        var previousLine = gem.line;
        this.animated_count++;
        gem.moveTo(column, line, function () {
            _this.grid[previousColumn][previousLine] = null;
            _this.grid[column][line] = gem;
            _this.animated_count--;
        });
    };
    /**
     * Add a new random gem to the given position.
     */
    Grid.prototype.addGem = function (column, line) {
        var _this = this;
        this.animated_count++;
        var gem = this.newRandomGem(column, -1);
        _this.grid[column][0] = gem;
        gem.moveTo(column, 0, function () {
            _this.animated_count--;
        });
    };
    /**
     * Find any gem chains/combinations and remove them (while adding to the score as well).
     */
    Grid.prototype.clearChains = function () {
        if (this.clearing) {
            return false;
        }
        var aChainCleared = this.checkForChains();
        if (!aChainCleared) {
            if (!this.isThereMoreValidMoves()) {
                Game.over('No more valid moves!');
            }
        }
        return aChainCleared;
    };
    /**
     * Clear the search flags from all the gems.
     */
    Grid.prototype.clearGemFlags = function () {
        var size = this.size;
        for (var column = 0; column < size; column++) {
            for (var line = 0; line < size; line++) {
                var gem = this.grid[column][line];
                if (gem) {
                    gem.already_checked_horizontal = false;
                    gem.already_checked_vertical = false;
                }
            }
        }
    };
    /**
     * Checks for gem chains (3+ gems in horizontal/vertical line), and clears them.
     */
    Grid.prototype.checkForChains = function () {
        var _this = this;
        var grid = this.grid;
        var size = this.size;
        var foundChains = false;
        var removeChain = function (endColumn, endLine, count, vertical) {
            if (vertical === true) {
                for (var line = endLine; line > endLine - count; line--) {
                    _this.removeGem(endColumn, line);
                }
            }
            else {
                for (var column = endColumn; column > endColumn - count; column--) {
                    _this.removeGem(column, endLine);
                }
            }
            Game.playCombineSound();
            Game.addToScore(count * 10);
            GameMenu.addToTimer(count);
        };
        for (var column = 0; column < size; column++) {
            for (var line = 0; line < size; line++) {
                var referenceGem = grid[column][line];
                if (!referenceGem) {
                    continue;
                }
                var horizontalChains = [];
                var verticalChains = [];
                // search for gem chains
                // uses a flood fill algorithm, to determine the connected chains (of the same id as the starting gem)
                // we have two flags for horizontal and vertical orientation, to know if we already checked the gem
                var check = function (gem, id) {
                    if (!gem ||
                        gem.id !== id ||
                        gem.already_checked_horizontal && gem.already_checked_vertical) {
                        return;
                    }
                    if (!gem.already_checked_horizontal) {
                        var chain = _this.checkHorizontalChain(gem.column, gem.line);
                        if (chain !== null) {
                            horizontalChains.push(chain);
                        }
                        gem.already_checked_horizontal = true;
                    }
                    if (!gem.already_checked_vertical) {
                        chain = _this.checkVerticalChain(gem.column, gem.line);
                        if (chain !== null) {
                            verticalChains.push(chain);
                        }
                        gem.already_checked_vertical = true;
                    }
                    var adjacents = _this.getAdjacentGems(gem.column, gem.line);
                    for (var a = 0; a < adjacents.length; a++) {
                        check(adjacents[a], id);
                    }
                };
                check(referenceGem, referenceGem.id);
                for (var a = 0; a < horizontalChains.length; a++) {
                    foundChains = true;
                    var chain = horizontalChains[a];
                    removeChain(chain.column + chain.size - 1, chain.line, chain.size, false);
                }
                for (var a = 0; a < verticalChains.length; a++) {
                    foundChains = true;
                    var chain = verticalChains[a];
                    removeChain(chain.column, chain.line + chain.size - 1, chain.size, true);
                }
            }
        }
        this.clearGemFlags();
        return foundChains;
    };
    /**
     * Check for a gem chain in the horizontal orientation.
     */
    Grid.prototype.checkHorizontalChain = function (column, line) {
        var size = this.size;
        var grid = this.grid;
        var countLeft = 0;
        var countRight = 0;
        var referenceGem = grid[column][line];
        if (!referenceGem) {
            return null;
        }
        var a = 0;
        var gem;
        // count to the right
        for (a = column + 1; a < size; a++) {
            gem = grid[a][line];
            if (gem && gem.id === referenceGem.id) {
                gem.already_checked_horizontal = true;
                countRight++;
            }
            else {
                break;
            }
        }
        // count to the left
        for (a = column - 1; a >= 0; a--) {
            gem = grid[a][line];
            if (gem && gem.id === referenceGem.id) {
                gem.already_checked_horizontal = true;
                countLeft++;
            }
            else {
                break;
            }
        }
        var count = countLeft + countRight + 1;
        if (count >= 3) {
            return {
                line: line,
                column: column - countLeft,
                size: count
            };
        }
        else {
            return null;
        }
    };
    /**
     * Check for a gem chain in the vertical orientation.
     */
    Grid.prototype.checkVerticalChain = function (column, line) {
        var size = this.size;
        var grid = this.grid;
        var countUp = 0;
        var countDown = 0;
        var referenceGem = this.grid[column][line];
        if (!referenceGem) {
            return null;
        }
        var a = 0;
        var gem;
        // count up
        for (a = line - 1; a >= 0; a--) {
            gem = grid[column][a];
            if (gem && gem.id === referenceGem.id) {
                gem.already_checked_vertical = true;
                countUp++;
            }
            else {
                break;
            }
        }
        // count down
        for (a = line + 1; a < size; a++) {
            gem = grid[column][a];
            if (gem && gem.id === referenceGem.id) {
                gem.already_checked_vertical = true;
                countDown++;
            }
            else {
                break;
            }
        }
        var count = countDown + countUp + 1;
        if (count >= 3) {
            return {
                line: line - countUp,
                column: column,
                size: count
            };
        }
        else {
            return null;
        }
    };
    /**
     * Get the gems around the given position (horizontal/vertical).
     */
    Grid.prototype.getAdjacentGems = function (column, line) {
        var adjacentGems = [];
        if (column > 0) {
            adjacentGems.push(this.grid[column - 1][line]);
        }
        if (column < this.size - 1) {
            adjacentGems.push(this.grid[column + 1][line]);
        }
        if (line > 0) {
            adjacentGems.push(this.grid[column][line - 1]);
        }
        if (line < this.size - 1) {
            adjacentGems.push(this.grid[column][line + 1]);
        }
        return adjacentGems;
    };
    /**
     * Convert a column/line position to an x/y position.
     */
    Grid.toCanvasPosition = function (column, line) {
        return {
            x: column * Gem.SIZE + Gem.SIZE / 2,
            y: line * Gem.SIZE + Gem.SIZE / 2
        };
    };
    /**
     * Checks if there are more valid moves available.
     * Returns the position of one of the gems that is part of a valid combination, or null if there are no more valid combinations.
     */
    Grid.prototype.isThereMoreValidMoves = function () {
        // loop here over the moves, for each gem
        var size = this.size;
        var grid = this.grid;
        var movesSize = Grid.ValidMoves.length;
        for (var column = 0; column < size; column++) {
            for (var line = 0; line < size; line++) {
                var gem = grid[column][line];
                if (!gem) {
                    continue;
                }
                var gemId = gem.id;
                for (var a = 0; a < movesSize; a++) {
                    var move = Grid.ValidMoves[a];
                    var one = move.one;
                    var two = move.two;
                    var oneColumn = column + one.columnOffset;
                    var oneLine = line + one.lineOffset;
                    var twoColumn = column + two.columnOffset;
                    var twoLine = line + two.lineOffset;
                    if ((grid[oneColumn] && grid[oneColumn][oneLine] && grid[oneColumn][oneLine].id === gemId) &&
                        (grid[twoColumn] && grid[twoColumn][twoLine] && grid[twoColumn][twoLine].id === gemId)) {
                        return grid[column + move.help.columnOffset][line + move.help.lineOffset];
                    }
                }
            }
        }
        return null;
    };
    /**
     * Clear the grid.
     */
    Grid.prototype.clear = function () {
        this.clearing = true;
        this.grid.length = 0;
        Gem._CONTAINER.removeAllChildren();
    };
    /**
     * Deals with the game logic.
     *     - Dropping the gems that have an empty position below.
     *     - Add new gems at empty positions on the first line.
     *     - Clear the gem chains, when there's no active animation.
     */
    Grid.prototype.tick = function () {
        // drop the gems
        for (var column = 0; column < this.size; column++) {
            for (var line = this.size - 1; line >= 0; line--) {
                var gem = this.grid[column][line];
                var below = this.grid[column][line + 1];
                if (gem && !gem.being_animated && !below) {
                    this.moveGem(gem, gem.column, gem.line + 1);
                }
            }
        }
        // add new gems at the top (if empty)
        for (var column = 0; column < this.size; column++) {
            var gem = this.grid[column][0];
            if (!gem) {
                this.addGem(column, 0);
            }
        }
        if (this.animated_count === 0) {
            this.clearChains();
        }
    };
    /*
        Cases where there's still a valid gem chain
        (the _x is the reference gem)
    
        _x xx | _xx x |    x | _xx  | _x   |   xx | _x x |   x
              |       | _xx  |    x |   xx | _x   |   x  | _x x
    
        _x | _x | _x  |  _x | _x  |  _x | _x  |  _x
         x |    |  x  |   x |   x |  x  |   x |  x
           |  x |   x |  x  |   x |  x  |  x  |   x
         x |  x |     |     |     |     |     |
    
        The reference gem has { columnOffset: 0, lineOffset: 0 }.
        The one/two gem are based on the reference gem position.
        The "help" is the gem to return to help the player find a valid combination.
     */
    Grid.ValidMoves = [
        {
            one: { columnOffset: 2, lineOffset: 0 },
            two: { columnOffset: 3, lineOffset: 0 },
            help: { columnOffset: 0, lineOffset: 0 }
        },
        {
            one: { columnOffset: 1, lineOffset: 0 },
            two: { columnOffset: 3, lineOffset: 0 },
            help: { columnOffset: 3, lineOffset: 0 }
        },
        {
            one: { columnOffset: 1, lineOffset: 0 },
            two: { columnOffset: 2, lineOffset: -1 },
            help: { columnOffset: 2, lineOffset: -1 }
        },
        {
            one: { columnOffset: 1, lineOffset: 0 },
            two: { columnOffset: 2, lineOffset: 1 },
            help: { columnOffset: 2, lineOffset: 1 }
        },
        {
            one: { columnOffset: 1, lineOffset: 1 },
            two: { columnOffset: 2, lineOffset: 1 },
            help: { columnOffset: 0, lineOffset: 0 }
        },
        {
            one: { columnOffset: 1, lineOffset: -1 },
            two: { columnOffset: 2, lineOffset: -1 },
            help: { columnOffset: 0, lineOffset: 0 }
        },
        {
            one: { columnOffset: 1, lineOffset: 1 },
            two: { columnOffset: 2, lineOffset: 0 },
            help: { columnOffset: 1, lineOffset: 1 }
        },
        {
            one: { columnOffset: 1, lineOffset: -1 },
            two: { columnOffset: 2, lineOffset: 0 },
            help: { columnOffset: 1, lineOffset: -1 }
        },
        {
            one: { columnOffset: 0, lineOffset: 1 },
            two: { columnOffset: 0, lineOffset: 3 },
            help: { columnOffset: 0, lineOffset: 3 }
        },
        {
            one: { columnOffset: 0, lineOffset: 2 },
            two: { columnOffset: 0, lineOffset: 3 },
            help: { columnOffset: 0, lineOffset: 0 }
        },
        {
            one: { columnOffset: 0, lineOffset: 1 },
            two: { columnOffset: 1, lineOffset: 2 },
            help: { columnOffset: 1, lineOffset: 2 }
        },
        {
            one: { columnOffset: 0, lineOffset: 1 },
            two: { columnOffset: -1, lineOffset: 2 },
            help: { columnOffset: -1, lineOffset: 2 }
        },
        {
            one: { columnOffset: 1, lineOffset: 1 },
            two: { columnOffset: 1, lineOffset: 2 },
            help: { columnOffset: 0, lineOffset: 0 }
        },
        {
            one: { columnOffset: -1, lineOffset: 1 },
            two: { columnOffset: -1, lineOffset: 2 },
            help: { columnOffset: 0, lineOffset: 0 }
        },
        {
            one: { columnOffset: 1, lineOffset: 1 },
            two: { columnOffset: 0, lineOffset: 2 },
            help: { columnOffset: 1, lineOffset: 1 }
        },
        {
            one: { columnOffset: -1, lineOffset: 1 },
            two: { columnOffset: 0, lineOffset: 2 },
            help: { columnOffset: -1, lineOffset: 1 }
        }
    ];
    return Grid;
}());
