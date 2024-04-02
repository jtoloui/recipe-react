import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { defineConfig, splitVendorChunkPlugin } from 'vite';
import preload from 'vite-plugin-preload';
import Sitemap from 'vite-plugin-sitemap';
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
    rollupOptions: {
      // output: {
      //   manualChunks(id: string) {
      //     if (id.includes('@zod') || id.includes('zod')) {
      //       return '@zod';
      //     }
      //     if (id.includes('react-hook-form')) {
      //       return '@react-hook-form';
      //     }
      //     if (id.includes('fontawesome')) {
      //       return '@fontawesome';
      //     }
      //     // creating a chunk to react routes deps. Reducing the vendor chunk size
      //     if (
      //       id.includes('react-router-dom') ||
      //       id.includes('@remix-run') ||
      //       id.includes('react-router') ||
      //       id.includes('react-dom')
      //     ) {
      //       return '@react-router';
      //     }
      //   },
      // },
    },
  },
  optimizeDeps: {
    include: ['@tanstack/react-query', 'react-router-dom'],
  },
  plugins: [
    react(),
    svgr({
      exportAsDefault: false,
    }),
    preload(),
    splitVendorChunkPlugin(),
    Sitemap({
      priority: 1,
      changefreq: 'daily',
      hostname: 'https://www.justcook.ing',
      dynamicRoutes: ['/recipes', '/my-recipes', '/login', '/welcome'],
      exclude: ['/reset-password', '/verify-email'],
    }),
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
    headers: isDev
      ? {
          'Content-Security-Policy':
            "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' blob: https://*.unsplash.com https://d35qwubl2aivrw.cloudfront.net https://media.justcook.ing; font-src 'self'; connect-src 'self' https://localhost:3001;",
        }
      : {},
  },
});
