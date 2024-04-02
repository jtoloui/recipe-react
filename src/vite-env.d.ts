/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly AUTH0_DOMAIN: string;
  readonly AUTH0_CLIENT_ID: string;
  readonly AUTH0_AUDIENCE: string;
  readonly VITE_API_URI: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface WindowEventMap extends CustomEvent {
  homeSearch: CustomEvent<{ search: string; label: string }>;
}
