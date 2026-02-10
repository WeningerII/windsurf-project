import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: './dist/stats.html',
      open: false,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }
            if (id.includes('lucide-react')) {
              return 'icons';
            }
            return 'vendor';
          }
          if (id.includes('src/data/dnd/5e-2014')) {
            return 'dnd-5e-2014-data';
          }
          if (id.includes('src/data/dnd/5e-2024')) {
            return 'dnd-5e-2024-data';
          }
          if (id.includes('src/data/pathfinder')) {
            return 'pathfinder-data';
          }
          if (id.includes('src/data/dnd/3.5e')) {
            return 'dnd-35e-data';
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    sourcemap: false,
  },
})
