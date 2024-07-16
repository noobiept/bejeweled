import { describe, expect, test, vi } from "vitest";
import { Grid } from "./grid";

describe("Grid", () => {
    test("Grid creation", () => {
        const size = 10;
        const onClick = vi.fn();
        const onGameOver = vi.fn();
        const onRemoveChain = vi.fn();
        const grid = new Grid({
            size,
            onClick,
            onGameOver,
            onRemoveChain,
        });

        expect(grid.size).toBe(size);
        expect(grid.grid.length).toBe(size);
        expect(grid.grid[0].length).toBe(size);
    });
});
