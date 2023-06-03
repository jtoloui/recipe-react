import React from 'react';
import ReactDOM from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { App } from './App';

import './styles/main.scss'; // Import main.scss

// Create a client
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Auth0Provider
      domain="toloui-eu.eu.auth0.com"
      clientId="obnLFqEjKW26S1BuflpBmc3h4abPhzyw"
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: 'https://toloui-eu.eu.auth0.com/api/v2/',
      }}
      cacheLocation="localstorage"
      useRefreshTokens
      // useCookiesForTransactions
    >
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </Auth0Provider>
  </React.StrictMode>
);
