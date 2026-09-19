import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import ReactDOM from 'react-dom/client';

import { App } from './App';
import './styles/main.css';

// Apply the persisted theme BEFORE React renders to avoid a flash of the wrong
// colour scheme. Mirrors the logic in useTheme (light / dark / system).
(() => {
  try {
    const stored = localStorage.getItem('jc-theme');
    const mode =
      stored === 'light' || stored === 'dark' || stored === 'system'
        ? stored
        : 'system';
    const dark =
      mode === 'dark' ||
      (mode === 'system' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.classList.toggle('dark', dark);
  } catch {
    // no-op: theme is a progressive enhancement
  }
})();

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // default: true
    },
  },
});

const root = document.getElementById('root') as HTMLElement;

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);
