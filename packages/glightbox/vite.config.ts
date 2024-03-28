// vite.config.ts
import { resolve } from 'path';
import { defineConfig, normalizePath } from 'vite';
import dts from 'vite-plugin-dts';
import { viteStaticCopy } from 'vite-plugin-static-copy';
// https://vitejs.dev/guide/build.html#library-mode

export default defineConfig({
    build: {
        minify: true,
        cssCodeSplit: true,
        cssMinify: true,
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'GLightBox',
            fileName: (format, entryName) => {
                if (format === 'umd') {
                    return `${entryName}.umd.js`;
                }
                if (format === 'cjs') {
                    return `${entryName}.cjs.js`;
                }
                return `${entryName}.es.js`;
            },
            formats: ['es', 'cjs', 'umd']
        }
    },
    plugins: [dts({}), viteStaticCopy({
        targets: [
            {
                // vite does not support multiple entries when using UMD
                // so for now we simply copy all styles
                src: normalizePath(resolve(__dirname, './src/*.css')),
                dest: ''
            }
        ]
    })]
    // plugins: [dts({
    //     beforeWriteFile: (filePath: string, content: string) => {
    //         return {
    //             filePath: filePath.replace('/dist/src/', '/dist/'),
    //             content
    //         };
    //     },
    //     // root: './dist',
    //     // copyDtsFiles: true,
    //     // rollupTypes: true
    // }), viteStaticCopy({
    //     targets: [
    //         {
    //             // vite does not support multiple entries when using UMD
    //             // so for now we simply copy all styles
    //             src: normalizePath(resolve(__dirname, './src/*.css')),
    //             dest: ''
    //         }
    //     ]
    // })]
});
