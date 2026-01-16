import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1000, // Optional: Increases the limit to 1000kb (1MB) to silence the warning
    rollupOptions: {
      output: {
        // This separates third-party libraries (node_modules) into a separate "vendor" chunk
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
  },
})