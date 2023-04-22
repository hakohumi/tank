import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    open: './server/src/index.ts',
  },
  build: {
    // outDir: '../../public',
  },
})
