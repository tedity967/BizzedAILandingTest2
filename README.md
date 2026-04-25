# BizzedAI Landing Page

The weekly deal teardown landing page for [bizzed.ai](https://www.bizzed.ai/).

## Project Structure

```
bizzed-landing/
├── css/
│   ├── global.css              # Reset, CSS variables, typography, nav, footer, keyframes
│   ├── components.css          # Shared components: cards, doc overlay, gates, dashboards
│   ├── home.css                # Homepage: hero, signup form, dual panels, ribbon
│   ├── teardowns.css           # Teardowns page: featured card, preview panel
│   ├── reports.css             # Reports page: pink-themed cards, exec cards, pet dashboard
│   ├── teardowns-inline.css    # Teardown doc-specific styles (groom-dash charts)
│   └── reports-inline.css      # Report doc-specific styles (pink theme overrides, pet/rural dash)
├── js/
│   ├── particles.js            # Canvas particle background animation
│   ├── signup.js               # Brevo email signup + returning user detection
│   └── doc-viewer.js           # Doc overlay open/close, content gates, ring animations, accordions
├── functions/
│   └── subscribe.js            # Cloudflare Pages serverless function (Brevo API)
├── index.html                  # Homepage
├── teardowns.html              # Teardowns archive + doc overlays
├── reports.html                # Executive reports archive + doc overlays
└── README.md
```

## Architecture

### CSS Layers (loaded in order)

1. **`global.css`** — Design tokens (`:root` variables), reset, scrollbar, background layers, nav, footer, shared keyframes. Loaded on every page.
2. **`components.css`** — Reusable UI: archive cards, coming-soon cards, doc-page overlay, content gates, verdict strips, BZ dashboard system, DD risk panels. Loaded on every page.
3. **Page-specific CSS** — Only what's unique to that page:
   - `home.css` → hero section, signup form, dual panels, latest ribbon
   - `teardowns.css` → featured teardown card, preview panel
   - `reports.css` → pink-themed featured card, exec cards, pet/rural dashboard panels
4. **Inline CSS** (`*-inline.css`) — Styles that were embedded inside individual doc bodies (chart-specific layouts). These are page-specific and only loaded where needed.

### JavaScript Modules

- **`particles.js`** — Self-executing canvas animation. Drop onto any page with a `<canvas id="bg-canvas">` element.
- **`signup.js`** — Handles the hero signup form on index.html. Exposes `addToBrevo()` globally for use by doc-viewer gates.
- **`doc-viewer.js`** — Exposes: `openDoc(id)`, `closeDoc()`, `submitGate(id)`, `toggleAccordion(id)`, `animateRings()`, `toggleRisk(el)`.

### Serverless Function

`functions/subscribe.js` runs on Cloudflare Pages Functions. It proxies signups to the Brevo API. Requires a `BREVO_API_KEY` environment variable.

## Design Tokens

All colors and design values are defined as CSS custom properties in `global.css`:

| Token | Value | Usage |
|-------|-------|-------|
| `--bg` | `#0a0816` | Page background |
| `--violet` | `#c4b5fd` | Primary accent (teardowns) |
| `--violet-deep` | `#8b5cf6` | CTA gradients |
| `--pink` | `#ec4899` | Secondary accent (reports) |
| `--pink-light` | `#f472b6` | Reports theme color |
| `--success` | `#10b981` | Positive signals |
| `--warn` | `#fbbf24` | Conditional/caution |
| `--danger` | `#ef4444` | Risk/negative |
| `--glass` | `rgba(255,255,255,.04)` | Glassmorphism base |

## Fonts

- **Instrument Sans** — Body text, UI elements
- **Instrument Serif** — Display headings, numbers, accents (italic)
- **JetBrains Mono** — Labels, badges, monospace UI

## Deployment

Hosted on **Cloudflare Pages**. Push to `main` to deploy.

```bash
# The functions/ directory is auto-detected by Cloudflare Pages
# Set BREVO_API_KEY in Cloudflare Pages > Settings > Environment Variables
```

## Adding a New Teardown

1. Add a new card to the archive grid in `teardowns.html` with `onclick="openDoc('XXX')"`
2. Add a new `<div class="doc-body" id="doc-XXX" style="display:none">` inside `#doc-page`
3. If the doc needs custom chart styles, add them to `css/teardowns-inline.css`
4. Update the featured card if this is the latest issue
5. Move the previous featured into the archive grid

## Adding a New Report

Same pattern as teardowns, but in `reports.html`. Use the pink-themed component classes (`exec-card`, `fp-kpi`, etc.).
