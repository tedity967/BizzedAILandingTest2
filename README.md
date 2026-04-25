# BizzedAI Landing Page

The weekly deal teardown landing page for [bizzed.ai](https://www.bizzed.ai/).

## Project Structure

```
bizzed-landing/
├── css/
│   ├── index.css               # All styles for the homepage
│   ├── teardowns.css           # All styles for the teardowns page + doc overlays
│   └── reports.css             # All styles for the reports page + doc overlays
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

## What Changed (vs the old structure)

| Before | After |
|--------|-------|
| CSS + HTML + JS all in one file per page | CSS, JS, HTML separated into their own files |
| ~100 lines of duplicated JS per page | 3 reusable JS modules |
| `functions/subscribe.js` serverless function | Unchanged — same file, same path |

The site renders identically to the original. Every class name, element, and animation is preserved.

## Architecture

### CSS (one file per page)

Each page loads a single CSS file containing all styles needed for that page and its doc overlays.

### JavaScript (3 shared modules)

| File | Purpose | Key Exports |
|------|---------|-------------|
| `particles.js` | Canvas particle + orb background | Self-executing; needs `<canvas id="bg-canvas">` |
| `signup.js` | Hero signup form, Brevo API, returning user | `addToBrevo()`, `saveUser()`, `getSavedUser()` |
| `doc-viewer.js` | Document overlay system | `openDoc(id)`, `closeDoc()`, `submitGate(id)`, `toggleAccordion(id)`, `animateRings()`, `toggleRisk(el)` |

### Serverless Function

`functions/subscribe.js` — Cloudflare Pages Function proxying signups to Brevo. Requires `BREVO_API_KEY` environment variable.

## Fonts

- **Instrument Sans** — Body text, UI
- **Instrument Serif** — Display headings, numbers (italic)
- **JetBrains Mono** — Labels, badges, monospace

## Deployment

Hosted on Cloudflare Pages. Push to `main` to deploy. Set `BREVO_API_KEY` in Settings > Environment Variables.

## Adding a New Teardown

1. Add a card to the archive grid in `teardowns.html` with `onclick="openDoc('XXX')"`
2. Add a `<div class="doc-body" id="doc-XXX" style="display:none">` inside `#doc-page`
3. If custom chart styles are needed, add them to `css/teardowns.css`
4. Update the featured card; move previous featured into archive

## Adding a New Report

Same pattern as teardowns, in `reports.html`. Use pink-themed classes (`exec-card`, `fp-kpi`, etc.).
