# AGENTS.md — Ask Mode

This file provides guidance to agents answering questions about this repository.

## What This Repo Contains

Three separate layers:
1. **HTML prototypes** (`docs/screens/`) — standalone, open in browser directly, no build needed
2. **Frontend** (`frontend/`) — React 19 + Vite 8 + TypeScript 6; `npm run dev` from that directory
3. **Backend** (`backend/`) — Python 3.14 scaffold managed with `uv`; FastAPI not yet installed

## Key "Isn't It…?" Clarifications

- The React app does **not** use Tailwind — that's only in the HTML prototypes.
- FastAPI is the **planned** backend framework but is not yet in `pyproject.toml` dependencies.
- The backend has its own `.git` — treat questions about its git history separately from the root repo.
- Python 3.14 is required; `uv` is the only supported package/environment manager (not pip, poetry, or pipenv).

## Two "Primary" Color Discrepancies

`DESIGN.md` prose refers to primary as `#1E40AF` and the Tailwind config in each `code.html` maps `primary` to `#00288e`. The **Tailwind config value (`#00288e`) is what the screens actually render**; the prose is a documentation approximation. When asked about colors, clarify which context applies.

## Screen Inventory

| Screen | shell-type | Key Audience |
|---|---|---|
| `report_issue_flow` | `web_standard` | Citizen filing a report |
| `public_issue_feed_map` | `web_standard` | Public map feed |
| `issue_detail_proof` | `web_standard` | Citizen tracking an issue |
| `authority_triage_dashboard` | `web_dashboard` | Municipal operator |
| `civic_pulse` | (design spec only) | — |

## Design Token Source of Truth

The YAML frontmatter in `DESIGN.md` = `docs/screens/civic_pulse/DESIGN.md` — they are **identical files**. Only one needs to be read.
