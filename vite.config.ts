import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/guardian': {
        target: 'https://content.guardianapis.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/guardian/, ''),
        secure: true,
        headers: {
          'User-Agent': 'HulyNews/1.0'
        }
      },
      '/api/twelvedata': {
        target: 'https://api.twelvedata.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/twelvedata/, ''),
        secure: true,
        headers: {
          'User-Agent': 'HulyNews/1.0'
        }
      },
      '/api/openweather': {
        target: 'https://api.openweathermap.org/data/2.5',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/openweather/, ''),
        secure: true,
        headers: {
          'User-Agent': 'HulyNews/1.0'
        }
      }
    }
  }
});