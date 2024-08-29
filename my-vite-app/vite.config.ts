import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import resolve from "vite-plugin-resolve";
import fs from "fs";
import path from "path";


const aztecVersion = JSON.parse(fs.readFileSync(path.join(__dirname, "package.json")).toString())["dependencies"]["@aztec/aztec.js"];
const cleanedVersion = aztecVersion.replace(/^\^/, '');

export default defineConfig({
    plugins: [
        process.env.NODE_ENV === "production"
            ? /** @type {any} */ (
                resolve({
                    "@aztec/bb.js": `export * from "https://unpkg.com/@aztec/bb.js@${cleanedVersion}/dest/browser/index.js"`,
                })
            )
            : undefined,
        nodePolyfills(),
    ],
    build: {
        target: "esnext",
    },
    optimizeDeps: {
        esbuildOptions: {
            target: "esnext",
        },
    },
});