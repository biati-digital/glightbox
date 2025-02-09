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
		sourcemap: true,
		lib: {
			entry: resolve(__dirname, "src/index.ts"),

			name: "GLightBox",
			fileName: (format, entryName) => {
				entryName = "glightbox";
				if (format === "umd") {
					return `${entryName}.umd.js`;
				}
				return `${entryName}.es.js`;
			},
			formats: ["es", "umd"],
		},
		rollupOptions: {
			output: {
				assetFileNames: "glightbox.[ext]",
				// assetFileNames: (assetInfo) => {
				//     if (assetInfo.name === 'index.css') {
				//         return 'glightbox.[ext]';
				//     }
				//     return assetInfo.name;
				// },
			},
		},
	},
	resolve: { alias: { "@style": resolve(__dirname, "src/glightbox.css") } },
	plugins: [dts({})],
});
