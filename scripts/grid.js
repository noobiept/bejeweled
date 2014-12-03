var Grid = (function () {
    function Grid(size) {
        this.grid = [];
        this.size = size;
        for (var column = 0; column < size; column++) {
            this.grid[column] = [];
            for (var line = 0; line < size; line++) {
                this.newRandomGem(column, line, true);
            }
        }
        this.clearChains();
    }
    Grid.prototype.newRandomGem = function (column, line, positionGem) {
        var gemType = Utilities.getRandomInt(0, Gem.TYPE_COUNT - 1);
        var gem = new Gem(gemType);
        if (positionGem === true) {
            gem.positionIn(column, line);
        }
        this.grid[column][line] = gem;
        return gem;
    };
    /*
        You can only switch 2 gems if they're adjacent with each other, and with a horizontal/vertical orientation
     */
    Grid.prototype.isValidSwitch = function (gem1, gem2) {
        var columnDiff = Math.abs(gem1.column - gem2.column);
        var lineDiff = Math.abs(gem1.line - gem2.line);
        if ((columnDiff === 0 && lineDiff === 1) || (lineDiff === 0 && columnDiff === 1)) {
            return true;
        }
        return false;
    };
    Grid.prototype.switchGems = function (gem1, gem2, checkIfValid) {
        if (checkIfValid === void 0) { checkIfValid = true; }
        var _this = this;
        // get the gem position before moving it (so we can then move the selected gem to this position)
        var gem1_column = gem1.column;
        var gem1_line = gem1.line;
        var gem2_column = gem2.column;
        var gem2_line = gem2.line;
        gem1.moveTo(gem2_column, gem2_line);
        gem2.moveTo(gem1_column, gem1_line, function () {
            if (checkIfValid) {
                // if a chain wasn't cleared, means we need to move undo the switch
                if (!_this.clearChains()) {
                    _this.switchGems(gem1, gem2, false);
                }
            }
        });
        gem1.column = gem2_column;
        gem1.line = gem2_line;
        gem2.column = gem1_column;
        gem2.line = gem1_line;
        this.grid[gem1_column][gem1_line] = gem2;
        this.grid[gem2_column][gem2_line] = gem1;
    };
    Grid.prototype.removeGem = function (column, line) {
        var gem = this.grid[column][line];
        if (gem !== null) {
            gem.remove();
            this.grid[column][line] = null;
        }
    };
    Grid.prototype.clearChains = function () {
        var aChainCleared = false;
        while (this.checkForChains()) {
            aChainCleared = true;
            this.reAddGems();
        }
        return aChainCleared;
    };
    Grid.prototype.clearGemFlags = function () {
        var size = this.size;
        for (var column = 0; column < size; column++) {
            for (var line = 0; line < size; line++) {
                var gem = this.grid[column][line];
                if (gem) {
                    gem.already_checked = false;
                }
            }
        }
    };
    /*
        Checks for gem chains (3+ gems in horizontal/vertical line), and clears them
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
        };
        for (var column = 0; column < size; column++) {
            for (var line = 0; line < size; line++) {
                var referenceGem = grid[column][line];
                if (referenceGem === null) {
                    continue;
                }
                var horizontalChains = [];
                var verticalChains = [];
                var check = function (gem, id) {
                    if (!gem || gem.already_checked || gem.id !== id) {
                        return;
                    }
                    var chain = _this.checkHorizontalChain(gem);
                    if (chain !== null) {
                        horizontalChains.push(chain);
                    }
                    chain = _this.checkVerticalChain(gem);
                    if (chain !== null) {
                        verticalChains.push(chain);
                    }
                    gem.already_checked = true;
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
    Grid.prototype.checkHorizontalChain = function (referenceGem) {
        var size = this.size;
        var grid = this.grid;
        var countLeft = 0;
        var countRight = 0;
        var column = referenceGem.column;
        var line = referenceGem.line;
        var a;
        var gem;
        for (a = column + 1; a < size; a++) {
            gem = grid[a][line];
            if (gem && gem.id === referenceGem.id) {
                countRight++;
            }
            else {
                break;
            }
        }
        for (a = column - 1; a >= 0; a--) {
            gem = grid[a][line];
            if (gem && gem.id === referenceGem.id) {
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
    Grid.prototype.checkVerticalChain = function (referenceGem) {
        var size = this.size;
        var grid = this.grid;
        var countUp = 0;
        var countDown = 0;
        var column = referenceGem.column;
        var line = referenceGem.line;
        var a;
        var gem;
        for (a = line - 1; a >= 0; a--) {
            gem = grid[column][a];
            if (gem && gem.id === referenceGem.id) {
                countUp++;
            }
            else {
                break;
            }
        }
        for (a = line + 1; a < size; a++) {
            gem = grid[column][a];
            if (gem && gem.id === referenceGem.id) {
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
    /*
        Existing gems fall down (so that all the gaps are on top), and then add new gems on top.
     */
    Grid.prototype.reAddGems = function () {
        var size = this.size;
        var gem;
        var line;
        for (var column = 0; column < size; column++) {
            var gems = [];
            for (line = 0; line < size; line++) {
                gem = this.grid[column][line];
                if (gem !== null) {
                    gems.push(gem);
                }
            }
            var gemDiff = size - gems.length;
            for (line = size - 1; line >= 0; line--) {
                gem = gems[line - gemDiff];
                if (gem) {
                    gem.moveTo(column, line);
                    this.grid[column][line] = gem;
                }
                else {
                    this.grid[column][line] = null;
                }
            }
            for (line = 0; line < size; line++) {
                if (this.grid[column][line] === null) {
                    gem = this.newRandomGem(column, line, false);
                    gem.positionIn(column, -(line + 1));
                    gem.moveTo(column, line);
                }
                else {
                    break;
                }
            }
        }
    };
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
    return Grid;
})();
