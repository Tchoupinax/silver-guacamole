// vite.config.ts
import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    include: ['test/*.js'],
    coverage: {
      reporter: ['text', 'json', 'html'],
    },
  },
});
