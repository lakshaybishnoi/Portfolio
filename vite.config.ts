import { defineConfig } from 'vite';

export default defineConfig({
    // Set base to your GitHub repo name for GitHub Pages
    // Change 'portfolio' to your actual repo name
    base: '/portfolio/',
    build: {
        outDir: 'dist',
    },
});
