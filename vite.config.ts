import { readFileSync } from 'node:fs';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8')) as { version: string };

export default defineConfig({
  plugins: [react()],
  // Relative asset URLs make the same build work on a root domain and on a GitHub Pages project subpath.
  base: './',
  define: { __APP_VERSION__: JSON.stringify(pkg.version) },
  build: {
    // Mermaid ships as its own lazily loaded chunks and is the only thing above the default limit.
    chunkSizeWarningLimit: 900,
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: false,
    testTimeout: 30_000,
  },
});
