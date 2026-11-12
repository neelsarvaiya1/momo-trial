import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
  },
  build: {
    // Prevent accidental exposure of sensitive file paths, source maps, and internals
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
  },
})
