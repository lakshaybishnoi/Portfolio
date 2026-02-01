import { defineConfig } from 'vite';

export default defineConfig({
    // For Vercel: no base needed (serves from root)
    // For GitHub Pages: uncomment and set to repo name
    // base: '/Portfolio/',
    build: {
        outDir: 'dist',
    },
});
