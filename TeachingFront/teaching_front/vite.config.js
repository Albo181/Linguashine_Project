import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const backendUrl = process.env.VITE_BACKEND_URL || 'https://linguashineproject-production.up.railway.app';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: backendUrl,
        changeOrigin: true,
        secure: true,
      },
      '/users': {
        target: backendUrl,
        changeOrigin: true,
        secure: true,
      },
      '/feedback': {
        target: backendUrl,
        changeOrigin: true,
        secure: true,
      },
      '/send_query': {
        target: backendUrl,
        changeOrigin: true,
        secure: true,
      },
      '/files': {
        target: backendUrl,
        changeOrigin: true,
        secure: true,
      }
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'mui-vendor': ['@mui/material', '@mui/icons-material'],
          'utils': ['axios', 'dayjs']
        }
      }
    },
    chunkSizeWarningLimit: 1000,
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.trace']
      },
      mangle: true,
      format: {
        comments: false
      }
    }
  }
});
