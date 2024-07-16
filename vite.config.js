import { defineConfig } from "vite";
import packageJson from "./package.json";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
    base: "",
    build: {
        outDir: `release/${packageJson.name} ${packageJson.version}`,
    },
    test: {
        include: ["source/**/*.test.ts"],
        coverage: {
            include: ["source/**/*.ts"],
        },
        setupFiles: ["./test/setup.ts"],
    },
    rollupOptions: {
        external: ["createjs"],
    },
    plugins: [tsConfigPaths()],
});
