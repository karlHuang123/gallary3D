import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  build: {
    chunkSizeWarningLimit: 700,
  },
  server: {
    proxy: {
      '/gallery/api': {
        target: 'http://47.102.125.150:8188',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/gallery\/api/, ''),
      },
    },
  },
  plugins: [react()],
})
