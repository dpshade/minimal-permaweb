import * as esbuild from 'esbuild';
import { mkdir } from 'node:fs/promises';

// Ensure dist directory exists
await mkdir('./dist', { recursive: true });

// Build the bundle
await esbuild.build({
    entryPoints: ['./src/index.js'],
    bundle: true,
    outfile: './dist/bundle.js',
    format: 'esm',
    platform: 'browser',
    target: 'es2020',
    sourcemap: true,
    inject: ['./src/global-shim.js'],
    define: {
        'global': 'window',
        'process.env.NODE_ENV': '"development"'
    },
    alias: {
        // Node.js built-in modules
        'stream': 'readable-stream',
        'readable-stream': 'readable-stream',
        'buffer': 'buffer',
        'util': 'util',
        'process': 'process/browser',
        'events': 'events',
        'path': 'path-browserify',
        'crypto': 'crypto-browserify'
    }
});
