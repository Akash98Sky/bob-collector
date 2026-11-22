# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Project Overview

**Civic Pulse** — a civic issue-reporting platform. The repo contains:
- HTML screen prototypes + a YAML-based design spec (`docs/`, `DESIGN.md`)
- A React + Vite + TypeScript frontend (`frontend/`)
- A Python + FastAPI backend scaffold (`backend/`)

## Repository Structure

```
DESIGN.md                          # Master design token spec (YAML frontmatter + prose)
docs/screens/<screen-name>/
  code.html                        # Standalone interactive HTML prototype
  screen.png                       # Reference screenshot
  DESIGN.md                        # Per-screen design notes (some screens)
frontend/                          # React 19 + Vite 8 + TypeScript 6 app
backend/                           # Python 3.14 + uv + FastAPI scaffold
```

Screens: `report_issue_flow`, `public_issue_feed_map`, `issue_detail_proof`, `authority_triage_dashboard`, `civic_pulse`.

---

## Frontend (`frontend/`)

### Commands (run from `frontend/`)
```
npm run dev       # Vite dev server (HMR)
npm run build     # tsc -b && vite build
npm run lint      # eslint .
npm run preview   # preview production build
```

No test runner is configured yet.

### Stack & Versions
- React **19**, Vite **8**, TypeScript **~6.0** (`erasableSyntaxOnly` enforced — no `enum`, no `namespace`)
- ESLint **10** with `typescript-eslint`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`

### TypeScript Config (non-obvious)
- `verbatimModuleSyntax: true` — all type imports must use `import type { ... }`
- `erasableSyntaxOnly: true` — TypeScript `enum` and `namespace` are **forbidden**; use plain objects or `as const`
- `moduleResolution: "bundler"` — `.ts`/`.tsx` extensions are allowed in imports
- `noUnusedLocals` and `noUnusedParameters` are **errors**, not warnings

### CSS / Styling
- **No Tailwind in the React app** — uses plain CSS with CSS custom properties (`--accent`, `--bg`, `--text`, etc.) defined in [`src/index.css`](frontend/src/index.css)
- `#root` is fixed at `width: 1126px` with `border-inline` decorative borders — keep this layout wrapper intact
- Dark mode via `@media (prefers-color-scheme: dark)` only (not a class toggle)

---

## Backend (`backend/`)

### Commands (run from `backend/`)
```
uv run backend    # runs src/backend/__init__.py:main()
uv sync           # install dependencies
```

### Stack & Versions
- Python **3.14** (pinned in `.python-version`) — requires uv for environment management
- Build backend: `uv_build` (not setuptools/hatch) — `pyproject.toml` uses `[build-system] requires = ["uv_build>=0.13.5,<0.14.0"]`
- Entry point: `backend = "backend:main"` → `src/backend/__init__.py::main()`
- FastAPI is planned but **not yet added** to `dependencies` in `pyproject.toml` — add it with `uv add fastapi`

### Package Layout
- Source lives under `src/backend/` (src layout) — imports use `from backend import ...`, not `from src.backend import ...`

---

## HTML Screen File Conventions

Every `code.html` shares an **identical boilerplate head** that must be preserved exactly:

1. **`<meta name="shell-type">`** — values seen: `web_standard` (citizen screens), `web_dashboard` (authority triage). This meta drives shell chrome injected by the host.
2. **Dual Material Symbols import** — two separate `<link>` tags for Material Symbols Outlined are always present (variable-font axes + display=swap variant).
3. **Font stack** — always `Manrope` + `Plus Jakarta Sans` from Google Fonts, full weight range `100..900`.
4. **Base `<style>` block** — `@layer base` reset + `overscroll-behavior:none` + `::-webkit-scrollbar{display:none}` — never remove these.
5. **Tailwind CDN** — `<script src="https://cdn.tailwindcss.com">` followed immediately by `<script id="tailwind-config">` with the full inline config object.

## Tailwind Configuration (identical across all screens)

The Tailwind config is **fully inlined** in each HTML file, not in a separate config file. It extends:
- **Colors**: Material Design 3 role-based tokens (e.g. `surface-container-low`, `on-primary`, `inverse-surface`) — all values come from `DESIGN.md` frontmatter.
- **Border radius**: overrides default (`DEFAULT: 0.25rem`, `lg: 0.5rem`, `xl: 0.75rem`, `full: 9999px`).
- **Spacing**: custom tokens (`space-xs`, `space-sm`, `space-md`, `space-lg`, `space-xl`, `gutter`, `gutter-lg`, `margin`, `margin-md`, `margin-lg`).
- **Typography plugins**: custom utilities registered for each type scale token (e.g. `font-headline-xl`, `text-headline-xl`, `font-body-md`, `text-body-md`, `font-label-sm`, `text-label-sm`, `font-numeric-stat`, `text-numeric-stat`). Usage is always a paired `font-<token>` + `text-<token>` class combination.

## Design Token Usage Rules

- **Never use raw hex colors** in HTML. Always use the semantic token class (e.g. `bg-primary`, `text-on-surface-variant`).
- **Typography**: always pair `font-<scale>` with `text-<scale>` on the same element (e.g. `class="font-headline-sm text-headline-sm"`).
- **Status colors are strictly mapped**: Open/Urgent → `error` tokens, In-Progress → `tertiary` tokens, Resolved → `secondary` tokens.
- **Numeric data** (upvotes, counts, coordinates) must use `font-numeric-stat text-numeric-stat` for tabular figures.
- All-caps status labels/badges use `font-label-sm text-label-sm uppercase tracking-wider`.

## Component Patterns

- **Triage row priority strip**: a `1.5px` left border (`w-1.5`) in the status color is the visual urgency indicator on card rows.
- **Maps**: rendered as `<div>` with `data-location="..."` attribute and `style="background-image: url(...)"` — not embedded iframes.
- **Photo upload zones**: always include a hidden `<input type="file" accept="image/*">` wired to a visible drag-and-drop UI div.
- **Modals/drawers**: toggled via `classList.add/remove('hidden')` + `'flex'` — no CSS transitions use JS animation libraries.
- **Interactivity**: all JS is in an IIFE `(function init...(){})()` or bare named functions at bottom of `<main>`, never in `<head>`.
