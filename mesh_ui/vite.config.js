import { sveltekit } from '@sveltejs/kit/vite';
import path from 'path';

/** @type {import('vite').UserConfig} */
const config = {
        server: {
            port: 6767,
            fs: {
                allow: ['..']
            }
        },
        plugins: [sveltekit()],
        resolve: {
            alias: {
                // these are the aliases and paths to them
                '@lib': path.resolve('./src/lib'),
                '@stores': path.resolve('./src/stores'),
                '@static': path.resolve('./src/static')
            }
        }
};

export default config;