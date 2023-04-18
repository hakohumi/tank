import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    open: './index.ts',
  },
  build: {
    outDir: '../public',
  },
})
