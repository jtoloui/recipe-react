import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import svgr from 'vite-plugin-svgr';
import path from 'path';

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
  plugins: [
    react(),
    svgr({
      exportAsDefault: false,
    }),
  ],
  server: {
    port: 3000,
    // host: true,
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
