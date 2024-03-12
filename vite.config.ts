import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { defineConfig } from 'vite';
import preload from 'vite-plugin-preload';
import svgr from 'vite-plugin-svgr';

const appEnv = process.env.APP_ENV;
const isDev = appEnv === 'development';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: [
      { find: '@', replacement: path.resolve(__dirname, 'src') },
      { find: './runtimeConfig', replacement: './runtimeConfig.browser' },
    ],
  },
  build: {
    sourcemap: isDev,
  },
  optimizeDeps: {
    include: ['react-query', 'react-router-dom'],
  },
  plugins: [
    react(),
    svgr({
      exportAsDefault: false,
    }),
    preload(),
  ],
  server: {
    port: 3000,
    host: true,
    open: true,
    https: isDev
      ? {
          key: fs.readFileSync('./certs/localhost-key.pem'),
          cert: fs.readFileSync('./certs/localhost.pem'),
        }
      : false,
    proxy: {
      '/api': {
        target: 'https://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
      '/auth': {
        target: 'https://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
