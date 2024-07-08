import { defineConfig } from "vite";
import packageJson from "./package.json";

export default defineConfig({
    base: "",
    build: {
        outDir: `release/${packageJson.name} ${packageJson.version}`,
    },
});
