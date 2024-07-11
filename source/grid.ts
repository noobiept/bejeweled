import { getRandomInt } from "@drk4/utilities";
import { Gem } from "./gem";
import * as Game from "./game";
import * as GameMenu from "./game_menu";
import type { GemChain, GemType } from "./types";
import { playCombineSound } from "./audio";

export class Grid {
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
    static readonly ValidMoves = [
        {
            one: { columnOffset: 2, lineOffset: 0 },
            two: { columnOffset: 3, lineOffset: 0 },
            help: { columnOffset: 0, lineOffset: 0 },
        },
        {
            one: { columnOffset: 1, lineOffset: 0 },
            two: { columnOffset: 3, lineOffset: 0 },
            help: { columnOffset: 3, lineOffset: 0 },
        },
        {
            one: { columnOffset: 1, lineOffset: 0 },
            two: { columnOffset: 2, lineOffset: -1 },
            help: { columnOffset: 2, lineOffset: -1 },
        },
        {
            one: { columnOffset: 1, lineOffset: 0 },
            two: { columnOffset: 2, lineOffset: 1 },
            help: { columnOffset: 2, lineOffset: 1 },
        },
        {
            one: { columnOffset: 1, lineOffset: 1 },
            two: { columnOffset: 2, lineOffset: 1 },
            help: { columnOffset: 0, lineOffset: 0 },
        },
        {
            one: { columnOffset: 1, lineOffset: -1 },
            two: { columnOffset: 2, lineOffset: -1 },
            help: { columnOffset: 0, lineOffset: 0 },
        },
        {
            one: { columnOffset: 1, lineOffset: 1 },
            two: { columnOffset: 2, lineOffset: 0 },
            help: { columnOffset: 1, lineOffset: 1 },
        },
        {
            one: { columnOffset: 1, lineOffset: -1 },
            two: { columnOffset: 2, lineOffset: 0 },
            help: { columnOffset: 1, lineOffset: -1 },
        },
        {
            one: { columnOffset: 0, lineOffset: 1 },
            two: { columnOffset: 0, lineOffset: 3 },
            help: { columnOffset: 0, lineOffset: 3 },
        },
        {
            one: { columnOffset: 0, lineOffset: 2 },
            two: { columnOffset: 0, lineOffset: 3 },
            help: { columnOffset: 0, lineOffset: 0 },
        },
        {
            one: { columnOffset: 0, lineOffset: 1 },
            two: { columnOffset: 1, lineOffset: 2 },
            help: { columnOffset: 1, lineOffset: 2 },
        },
        {
            one: { columnOffset: 0, lineOffset: 1 },
            two: { columnOffset: -1, lineOffset: 2 },
            help: { columnOffset: -1, lineOffset: 2 },
        },
        {
            one: { columnOffset: 1, lineOffset: 1 },
            two: { columnOffset: 1, lineOffset: 2 },
            help: { columnOffset: 0, lineOffset: 0 },
        },
        {
            one: { columnOffset: -1, lineOffset: 1 },
            two: { columnOffset: -1, lineOffset: 2 },
            help: { columnOffset: 0, lineOffset: 0 },
        },
        {
            one: { columnOffset: 1, lineOffset: 1 },
            two: { columnOffset: 0, lineOffset: 2 },
            help: { columnOffset: 1, lineOffset: 1 },
        },
        {
            one: { columnOffset: -1, lineOffset: 1 },
            two: { columnOffset: 0, lineOffset: 2 },
            help: { columnOffset: -1, lineOffset: 1 },
        },
    ];

    grid: (Gem | null)[][];
    size: number;

    clearing: boolean;
    animated_count = 0;

    constructor(size: number) {
        this.grid = [];
        this.size = size;
        this.clearing = false;

        for (let column = 0; column < size; column++) {
            this.grid[column] = [];

            for (let line = 0; line < size; line++) {
                const gem = this.newRandomGem(column, line);
                this.grid[column][line] = gem;
            }
        }
    }

    /**
     * Add a random gem to the given position.
     */
    newRandomGem(column: number, line: number) {
        const gemType = getRandomInt(0, Gem.TYPE_COUNT - 1);

        const gem = new Gem(gemType);
        gem.positionIn(column, line);

        return gem;
    }

    /**
     * Check if you can switch the given gems. You can only switch 2 gems if they're adjacent with each other, and with a horizontal/vertical orientation.
     */
    isValidSwitch(gem1: Gem, gem2: Gem) {
        const columnDiff = Math.abs(gem1.column - gem2.column);
        const lineDiff = Math.abs(gem1.line - gem2.line);

        if (
            (columnDiff === 0 && lineDiff === 1) ||
            (lineDiff === 0 && columnDiff === 1)
        ) {
            return true;
        }

        return false;
    }

    /**
     * Try to switch the given gems. If its not possible, then the gems will switch back to the original position.
     */
    switchGems(gem1: Gem, gem2: Gem) {
        // get the gem position before moving it (so we can then move the selected gem to this position)
        const gem1_column = gem1.column;
        const gem1_line = gem1.line;

        const gem2_column = gem2.column;
        const gem2_line = gem2.line;

        // switch the gems, and check if it leads to a chain
        gem1.column = gem2_column;
        gem1.line = gem2_line;

        gem2.column = gem1_column;
        gem2.line = gem1_line;

        this.grid[gem1_column][gem1_line] = gem2;
        this.grid[gem2_column][gem2_line] = gem1;

        this.animated_count++;

        gem1.moveTo(gem2_column, gem2_line);
        gem2.moveTo(gem1_column, gem1_line, () => {
            // if it doesn't lead to a chain, we need to move it back
            if (
                this.checkHorizontalChain(gem1_column, gem1_line) === null &&
                this.checkVerticalChain(gem1_column, gem1_line) === null &&
                this.checkHorizontalChain(gem2_column, gem2_line) === null &&
                this.checkVerticalChain(gem2_column, gem2_line) === null
            ) {
                gem1.column = gem1_column;
                gem1.line = gem1_line;

                gem2.column = gem2_column;
                gem2.line = gem2_line;

                this.grid[gem1_column][gem1_line] = gem1;
                this.grid[gem2_column][gem2_line] = gem2;

                gem1.moveTo(gem1_column, gem1_line);
                gem2.moveTo(gem2_column, gem2_line, () => {
                    this.animated_count--;
                });
            } else {
                this.animated_count--;
            }
        });
    }

    /**
     * Remove a gem from the grid.
     */
    removeGem(column: number, line: number) {
        const gem = this.grid[column][line];
        this.animated_count++;

        if (gem !== null) {
            gem.remove(() => {
                this.grid[column][line] = null;
                this.animated_count--;
            });
        }
    }

    /**
     * Move a gem to a new position.
     */
    moveGem(gem: Gem, column: number, line: number) {
        if (
            column < 0 ||
            column >= this.size ||
            line < 0 ||
            line >= this.size
        ) {
            return;
        }

        const previousColumn = gem.column;
        const previousLine = gem.line;
        this.animated_count++;

        gem.moveTo(column, line, () => {
            this.grid[previousColumn][previousLine] = null;
            this.grid[column][line] = gem;
            this.animated_count--;
        });
    }

    /**
     * Add a new random gem to the given position.
     */
    addGem(column: number) {
        this.animated_count++;

        const gem = this.newRandomGem(column, -1);
        this.grid[column][0] = gem;

        gem.moveTo(column, 0, () => {
            this.animated_count--;
        });
    }

    /**
     * Find any gem chains/combinations and remove them (while adding to the score as well).
     */
    clearChains(): boolean {
        if (this.clearing) {
            return false;
        }

        const aChainCleared = this.checkForChains();

        if (!aChainCleared) {
            if (!this.isThereMoreValidMoves()) {
                Game.over("No more valid moves!");
            }
        }

        return aChainCleared;
    }

    /**
     * Clear the search flags from all the gems.
     */
    clearGemFlags() {
        const size = this.size;

        for (let column = 0; column < size; column++) {
            for (let line = 0; line < size; line++) {
                const gem = this.grid[column][line];

                if (gem) {
                    gem.already_checked_horizontal = false;
                    gem.already_checked_vertical = false;
                }
            }
        }
    }

    private removeChain(
        endColumn: number,
        endLine: number,
        count: number,
        vertical: boolean
    ) {
        if (vertical === true) {
            for (let line = endLine; line > endLine - count; line--) {
                this.removeGem(endColumn, line);
            }
        } else {
            for (let column = endColumn; column > endColumn - count; column--) {
                this.removeGem(column, endLine);
            }
        }

        playCombineSound();
        Game.addToScore(count * 10);
        GameMenu.addToTimer(count);
    }

    /**
     * Checks for gem chains (3+ gems in horizontal/vertical line), and clears them.
     */
    checkForChains(): boolean {
        const grid = this.grid;
        const size = this.size;
        let foundChains = false;

        for (let column = 0; column < size; column++) {
            for (let line = 0; line < size; line++) {
                const referenceGem = grid[column][line];

                if (!referenceGem) {
                    continue;
                }

                const horizontalChains: GemChain[] = [];
                const verticalChains: GemChain[] = [];

                // search for gem chains
                // uses a flood fill algorithm, to determine the connected chains (of the same id as the starting gem)
                // we have two flags for horizontal and vertical orientation, to know if we already checked the gem
                const check = (gem: Gem, id: GemType) => {
                    if (
                        !gem ||
                        gem.id !== id ||
                        (gem.already_checked_horizontal &&
                            gem.already_checked_vertical)
                    ) {
                        return;
                    }

                    if (!gem.already_checked_horizontal) {
                        const chain = this.checkHorizontalChain(
                            gem.column,
                            gem.line
                        );
                        if (chain !== null) {
                            horizontalChains.push(chain);
                        }

                        gem.already_checked_horizontal = true;
                    }

                    if (!gem.already_checked_vertical) {
                        const chain = this.checkVerticalChain(
                            gem.column,
                            gem.line
                        );
                        if (chain !== null) {
                            verticalChains.push(chain);
                        }

                        gem.already_checked_vertical = true;
                    }

                    const adjacents = this.getAdjacentGems(
                        gem.column,
                        gem.line
                    );

                    for (let a = 0; a < adjacents.length; a++) {
                        check(adjacents[a], id);
                    }
                };

                check(referenceGem, referenceGem.id);

                for (let a = 0; a < horizontalChains.length; a++) {
                    foundChains = true;

                    const chain = horizontalChains[a];
                    this.removeChain(
                        chain.column + chain.size - 1,
                        chain.line,
                        chain.size,
                        false
                    );
                }

                for (let a = 0; a < verticalChains.length; a++) {
                    foundChains = true;

                    const chain = verticalChains[a];
                    this.removeChain(
                        chain.column,
                        chain.line + chain.size - 1,
                        chain.size,
                        true
                    );
                }
            }
        }

        this.clearGemFlags();

        return foundChains;
    }

    /**
     * Check for a gem chain in the horizontal orientation.
     */
    checkHorizontalChain(column: number, line: number): GemChain | null {
        const size = this.size;
        const grid = this.grid;
        let countLeft = 0;
        let countRight = 0;
        const referenceGem = grid[column][line];

        if (!referenceGem) {
            return null;
        }

        // count to the right
        for (let a = column + 1; a < size; a++) {
            const gem = grid[a][line];

            if (gem && gem.id === referenceGem.id) {
                gem.already_checked_horizontal = true;
                countRight++;
            } else {
                break;
            }
        }

        // count to the left
        for (let a = column - 1; a >= 0; a--) {
            const gem = grid[a][line];

            if (gem && gem.id === referenceGem.id) {
                gem.already_checked_horizontal = true;
                countLeft++;
            } else {
                break;
            }
        }

        const count = countLeft + countRight + 1;

        if (count >= 3) {
            return {
                line: line,
                column: column - countLeft,
                size: count,
            };
        } else {
            return null;
        }
    }

    /**
     * Check for a gem chain in the vertical orientation.
     */
    checkVerticalChain(column: number, line: number): GemChain | null {
        const size = this.size;
        const grid = this.grid;
        let countUp = 0;
        let countDown = 0;
        const referenceGem = this.grid[column][line];

        if (!referenceGem) {
            return null;
        }

        // count up
        for (let a = line - 1; a >= 0; a--) {
            const gem = grid[column][a];

            if (gem && gem.id === referenceGem.id) {
                gem.already_checked_vertical = true;
                countUp++;
            } else {
                break;
            }
        }

        // count down
        for (let a = line + 1; a < size; a++) {
            const gem = grid[column][a];

            if (gem && gem.id === referenceGem.id) {
                gem.already_checked_vertical = true;
                countDown++;
            } else {
                break;
            }
        }

        const count = countDown + countUp + 1;

        if (count >= 3) {
            return {
                line: line - countUp,
                column: column,
                size: count,
            };
        } else {
            return null;
        }
    }

    /**
     * Get the gems around the given position (horizontal/vertical).
     */
    getAdjacentGems(column: number, line: number) {
        const adjacentGems: Gem[] = [];

        if (column > 0) {
            adjacentGems.push(this.grid[column - 1][line]!);
        }

        if (column < this.size - 1) {
            adjacentGems.push(this.grid[column + 1][line]!);
        }

        if (line > 0) {
            adjacentGems.push(this.grid[column][line - 1]!);
        }

        if (line < this.size - 1) {
            adjacentGems.push(this.grid[column][line + 1]!);
        }

        return adjacentGems;
    }

    /**
     * Convert a column/line position to an x/y position.
     */
    static toCanvasPosition(column: number, line: number) {
        return {
            x: column * Gem.SIZE + Gem.SIZE / 2,
            y: line * Gem.SIZE + Gem.SIZE / 2,
        };
    }

    /**
     * Checks if there are more valid moves available.
     * Returns the position of one of the gems that is part of a valid combination, or null if there are no more valid combinations.
     */
    isThereMoreValidMoves(): Gem | null {
        // loop here over the moves, for each gem
        const size = this.size;
        const grid = this.grid;
        const movesSize = Grid.ValidMoves.length;

        for (let column = 0; column < size; column++) {
            for (let line = 0; line < size; line++) {
                const gem = grid[column][line];

                if (!gem) {
                    continue;
                }

                const gemId = gem.id;

                for (let a = 0; a < movesSize; a++) {
                    const move = Grid.ValidMoves[a];
                    const one = move.one;
                    const two = move.two;
                    const oneColumn = column + one.columnOffset;
                    const oneLine = line + one.lineOffset;
                    const twoColumn = column + two.columnOffset;
                    const twoLine = line + two.lineOffset;

                    if (
                        grid[oneColumn] &&
                        grid[oneColumn][oneLine] &&
                        grid[oneColumn][oneLine]!.id === gemId &&
                        grid[twoColumn] &&
                        grid[twoColumn][twoLine] &&
                        grid[twoColumn][twoLine]!.id === gemId
                    ) {
                        return grid[column + move.help.columnOffset][
                            line + move.help.lineOffset
                        ];
                    }
                }
            }
        }

        return null;
    }

    /**
     * Clear the grid.
     */
    clear() {
        this.clearing = true;
        this.grid.length = 0;

        Gem._CONTAINER.removeAllChildren();
    }

    /**
     * Deals with the game logic.
     *     - Dropping the gems that have an empty position below.
     *     - Add new gems at empty positions on the first line.
     *     - Clear the gem chains, when there's no active animation.
     */
    tick() {
        // drop the gems
        for (let column = 0; column < this.size; column++) {
            for (let line = this.size - 1; line >= 0; line--) {
                const gem = this.grid[column][line];
                const below = this.grid[column][line + 1];

                if (gem && !gem.being_animated && !below) {
                    this.moveGem(gem, gem.column, gem.line + 1);
                }
            }
        }

        // add new gems at the top (if empty)
        for (let column = 0; column < this.size; column++) {
            const gem = this.grid[column][0];

            if (!gem) {
                this.addGem(column);
            }
        }

        if (this.animated_count === 0) {
            this.clearChains();
        }
    }
}
