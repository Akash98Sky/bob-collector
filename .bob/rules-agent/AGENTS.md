# AGENTS.md — Agent (Coding) Mode

This file provides guidance to agents when writing or modifying code in this repository.

## Frontend Gotchas

- `verbatimModuleSyntax: true` → type-only imports must be `import type { Foo }`, not `import { Foo }`. The linter errors on this.
- `erasableSyntaxOnly: true` → no `enum` or `namespace` — use `const` objects or union types instead.
- `noUnusedLocals` / `noUnusedParameters` are **build errors** — prefix unused vars with `_` or remove them before `npm run build`.
- The React app uses plain CSS (`index.css` + `App.css`) with CSS custom properties — **no Tailwind, no CSS modules, no styled-components**.
- `@vitejs/plugin-react` uses Babel transform (not SWC). Using `@vitejs/plugin-react-swc` would require a package swap.

## Backend Gotchas

- Python **3.14** is required — standard installs (pyenv, system Python) won't work. Must use **uv** (`uv sync`, `uv run`).
- FastAPI is not yet in `pyproject.toml`. Add it with `uv add fastapi` before writing any route code.
- Build system is `uv_build`, not setuptools — do not add a `setup.py` or `setup.cfg`.
- Entry point is the `main()` function in `src/backend/__init__.py` (src layout). The package name is `backend`, not `src.backend`.
- The backend has its own `.git` directory (`backend/.git`) — it may be a git submodule or separate repo.

## Critical: Tailwind Config Must Stay Inline (HTML Prototypes)

The Tailwind config is duplicated verbatim inside every `code.html` via `<script id="tailwind-config">`. When creating a new screen, copy the full config block from an existing file — do NOT reference an external `tailwind.config.js`.

## Typography Utility Classes Are Custom Plugins

The `font-headline-sm`, `text-body-md`, `font-label-sm`, etc. classes are registered as Tailwind plugin utilities inside the inline config — they are **not** standard Tailwind classes. Always use the **pair** (`font-<scale>` + `text-<scale>`) or the class will apply only the font-family without size/weight/line-height.

## Color Tokens vs. DESIGN.md Values

The color tokens in the Tailwind config (e.g. `primary: '#00288e'`) come from `DESIGN.md` frontmatter, **not** from the prose color descriptions in the same file (which reference `#1E40AF` as "primary"). The frontmatter values are authoritative for class generation; the prose is advisory.

## Adding a New Screen

1. Copy the head boilerplate + Tailwind config block from an existing `code.html` exactly.
2. Set `<meta name="shell-type">` to `web_standard` (citizen flow) or `web_dashboard` (authority/admin).
3. Create directory `docs/screens/<screen-name>/` and add `code.html` (and optionally `DESIGN.md`).
4. All JS interactivity goes inside `<main>` at the bottom in an IIFE — never in `<head>` or `<body>` directly.

## Status Badge Pattern (copy-exact)

```html
<!-- Open -->
<span class="px-2 py-0.5 bg-error-container/60 text-error rounded-full font-label-sm text-[11px] font-bold">● Open</span>
<!-- In Progress -->
<span class="px-2 py-0.5 bg-tertiary-fixed/60 text-on-tertiary-fixed rounded-full font-label-sm text-[11px] font-bold">● In Progress</span>
<!-- Resolved -->
<span class="px-2 py-0.5 bg-secondary-fixed/50 text-on-secondary-container rounded-full font-label-sm text-[11px] font-bold">● Resolved</span>
```
