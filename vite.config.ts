import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { visualizer } from 'rollup-plugin-visualizer'
import viteCompression from 'vite-plugin-compression'

export default defineConfig({
  plugins: [
    react(),
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 10240,
    }),
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
      threshold: 10240,
    }),
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

          // Split large SRD datasets into per-system chunks.
          if (id.includes('src/data/dnd/5e-2014')) {
            return 'dnd-5e-2014-data';
          }
          if (id.includes('src/data/dnd/5e-2024')) {
            return 'dnd-5e-2024-data';
          }
          if (id.includes('src/data/dnd/3.5e')) {
            return 'dnd-35e-data';
          }
          if (id.includes('src/data/pathfinder/1e')) {
            return 'pf1e-data';
          }
          if (id.includes('src/data/pathfinder/2e')) {
            return 'pf2e-data';
          }
          if (id.includes('src/data/mutants-and-masterminds/3e')) {
            return 'mam3e-data';
          }
          if (id.includes('src/data/daggerheart')) {
            return 'daggerheart-data';
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    sourcemap: false,
  },
})
