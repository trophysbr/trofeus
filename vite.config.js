import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // Configura o alias @ para apontar para a pasta src
    },
  },
  server: {
    port: 5173,
    host: true
  },
  build: {
    outDir: "dist"
  },
  preview: {
    port: 4173,
    host: true
  }
})
