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
  }
});
