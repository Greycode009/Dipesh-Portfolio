# Dipesh Malla — Portfolio

Personal portfolio, being rebuilt as a pixel-game world backed by a CMS.

## Structure

    frontend/   React + Vite + TypeScript + Tailwind  → Vercel
    backend/    Express + Sequelize + PostgreSQL      → Railway/Fly (Phase 2)

### frontend

    src/
      api/        HTTP seams for dynamic features (contact, later guestbook/presence)
      components/ Shared UI
      content/    Projects, skills, timeline, bio — generated from the CMS in Phase 2
      context/    React context providers
      hooks/
      pages/      One file per route
      styles/     Tailwind entry + theme tokens
      types/      Shapes shared with the API

Styling is Tailwind only. Theme colours are CSS custom properties holding
space-separated RGB channels, so opacity modifiers (`bg-primary/10`) work
against whichever of the four themes is active. Themes switch via the
`data-theme` attribute on `<html>`.

## Running

    cd frontend
    npm install
    cp .env.example .env.local   # EmailJS credentials for the contact form
    npm run dev                  # http://localhost:3000
    npm run build      # client build, SSR build, then prerender each route
    npm run typecheck

`npm run build` writes one static HTML file per route in `src/routes.ts`
(`dist/about/index.html`, and so on), each with its own title, description,
canonical and Open Graph tags. Note that `npm run preview` does *not* serve
those files — it falls back to `dist/index.html` for every path, so a route
other than `/` will look wrong locally. Inspect the generated files directly,
or deploy, to check prerendering.

## Deployment

The Vercel project's **Root Directory** must be set to `frontend`, since the app
no longer lives at the repository root. `frontend/vercel.json` supplies the SPA
rewrite that client-side routing needs — as a fallback only, since Vercel
checks the filesystem before applying rewrites, so the prerendered per-route
files win.

## Roadmap

1. **Foundations** — Vite + TypeScript, Tailwind-only styling, content extracted, routes prerendered. *(this branch)*
2. **CMS** — Express + Sequelize + Postgres, admin UI, GitHub project import.
3. **The Room** — Phaser pixel world: arcade cabinets, skill inventory, dialogue, mailbox.
4. **Living world** — guestbook and ghost visitors.
