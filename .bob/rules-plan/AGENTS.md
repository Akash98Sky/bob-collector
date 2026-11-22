# AGENTS.md — Plan Mode

This file provides guidance to agents planning work in this repository.

## Architectural Constraints

### HTML Prototypes
- **Inline Tailwind only**: The CDN script + inline config is the only Tailwind setup. Centralizing it requires touching every `code.html` file.
- **Shared head boilerplate is duplicated**: No template inheritance. Changes to the shared head (fonts, base styles, Tailwind config) must be applied to each file individually.

### Frontend (`frontend/`)
- **No shared state management or router yet** — the app is a Vite scaffold. Any plan for routing or state must introduce the library from scratch.
- **CSS custom properties, not Tailwind** — styling plans must use `--var` tokens in CSS or add a new styling system; don't assume Tailwind is available.
- `tsc -b` runs before Vite build — TypeScript type errors will block the production build.

### Backend (`backend/`)
- **FastAPI not yet installed** — any plan that adds routes must start with `uv add fastapi uvicorn`.
- **src layout** — the importable package is `backend` (from `src/backend/`). Do not plan a flat layout.
- **Separate git repo** (`backend/.git`) — plan git operations (commits, branches) for the backend independently of the root repo.
- **Python 3.14 only** — no plan should assume 3.11/3.12 compatibility; 3.14 may use pre-release APIs.

## Design System Consistency Requirement

When planning new screens, all color and typography values **must** derive from the token set in `DESIGN.md` frontmatter. Introducing ad-hoc hex colors or non-token Tailwind classes breaks the system.

## Status / Routing Model

The four ticket statuses (`Open → In Progress → Resolved`) map to specific token families:
- Open: `error` family
- In Progress: `tertiary` family  
- Resolved: `secondary` family

Any plan involving status changes must keep this mapping consistent across citizen and authority views.

## GPS Fencing Constraint (by design)

The resolution drawer enforces that closure photos require GPS proximity to the original report pin. Any plan that bypasses this (e.g. bulk-resolve without photo proof) violates a core product requirement documented in the user query context.

## Responsive Breakpoints

- Mobile `< 768px`: single column, full-bleed maps as bottom sheets
- Tablet `768–1024px`: split-pane (50/50 map/list)
- Desktop `> 1024px`: 12-col, max-width `1280px`, left nav anchored
