# JustCooking — brand mark & logo system

The chosen mark is **Nest Steam**: a rounded bowl ("nest") with three rising
steam ribbons. It is implemented in the app as two React components:

- `src/assets/Logo.tsx` — the mark alone.
- `src/assets/LogoWithText.tsx` — the mark + `justcooking` wordmark (nav, welcome, auth pages).
- `public/logo_plain.svg` + the `apple-touch-icon` / `android-chrome-*` PNGs — favicons / app icons, generated from the SVG.

## Colour rules (surface-aware — never green-on-green)

The mark **recolours to its surface** so it always stays legible:

| Surface | Bowl | Steam | Wordmark |
|---|---|---|---|
| Light UI (default) | green `#30BE76` | amber `#F8B449` | ink `just` + green `cooking` |
| Dark UI | white `#FFFFFF` | amber `#F8B449` | white |
| **Brand green** `#30BE76` | white `#FFFFFF` | amber `#F8B449` (**treatment A**) | white |
| App-icon tile | green tile + white bowl + amber steam | — | — |

Both components accept `surface?: 'light' | 'dark' | 'green'` (default `light`).
On a green surface pass `surface="green"` so the bowl knocks out to white —
a green bowl on a green background is invisible and must never be used.

Palette: green `#30BE76`, amber `#F8B449`, dark ink `#0F1F17`, darker green `#1D7247`.

## Demos (open in a browser)

- `logo-explorations.html` — the 16 original directions we explored.
- `nest-steam.html` — the refined chosen mark in every form (primary, squircle
  app icon, round badge, wordmark lockup, favicons) with a light/dark/green
  surface toggle that re-renders each mark in its correct treatment.

These are static design references — not part of the app build.
