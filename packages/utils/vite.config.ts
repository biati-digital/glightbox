// vite.config.ts
import { resolve } from "node:path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
// https://vitejs.dev/guide/build.html#library-mode

export default defineConfig({
	build: {
		minify: true,
		cssCodeSplit: true,
		cssMinify: true,
		lib: {
			entry: resolve(__dirname, "src/index.ts"),
			name: "DragPlugin",
			fileName: (format, entryName) => {
				if (format === "umd") {
					return `${entryName}.umd.js`;
				}
				if (format === "cjs") {
					return `${entryName}.cjs.js`;
				}
				return `${entryName}.es.js`;
			},
			formats: ["es", "cjs", "umd"],
		},
	},
	plugins: [dts()],
});
