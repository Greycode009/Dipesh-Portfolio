# Dipesh Malla — Portfolio

Personal portfolio, being rebuilt as a pixel-game world backed by a CMS.

## Structure

    frontend/   React + Vite + TypeScript + Tailwind  → Vercel
    backend/    Express + Sequelize + PostgreSQL      → Railway/Fly (Phase 2)

### frontend

    src/
      api/        HTTP seams for dynamic features (contact, later guestbook/presence)
      game/       The room: sprites, tile map, engine, in-world panels
      components/ Shared UI
      content/    Projects, skills, timeline, bio — generated from the CMS in Phase 2
      context/    React context providers
      hooks/
      pages/      One file per route
      styles/     Tailwind entry + theme tokens
      types/      Shapes shared with the API

The design is brutalist: monochrome with one sharp red accent, hard 2px rules
instead of soft cards, offset block shadows, oversized uppercase display type
(Space Grotesk) with monospace labels (JetBrains Mono), and no easing softness.

The pixel room lives at `/room` as an easter egg, loaded only when asked for.
Its sprites are authored in code as grids of palette characters
(`src/game/sprites.ts`) and rasterised to canvas at startup — there are no
image assets and nothing to license.

Styling is Tailwind only. Theme colours are CSS custom properties holding
space-separated RGB channels, so opacity modifiers (`bg-primary/10`) work
against whichever theme is active. There are two — light and dark, a warm
amber accent on paper or charcoal — switched via the `data-theme` attribute on
`<html>`. A visitor with no stored preference follows their operating system,
and an inline script in `index.html` applies the theme before first paint so
the prerendered page never flashes the wrong one.

## Running

    cd frontend
    npm install
    cp .env.example .env.local   # EmailJS credentials for the contact form
    npm run dev                  # http://localhost:3000
    npm run sync:content         # pull CMS content into src/content/
    npm run build      # client build, SSR build, then prerender each route
    npm run typecheck

Editing content: sign in at `/admin`, make changes, then run
`npm run sync:content` to regenerate `src/content/*.ts` from the API and
rebuild. Content ships in the bundle rather than being fetched at runtime, so
the site stays fast and survives the API being down.

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
2. **CMS** — Express + Sequelize + Postgres, admin UI at `/admin`, GitHub
   project import. *(Image upload and migrations still to come.)*
3. **The Room** — pixel world at `/room`: arcade cabinets, skill inventory, dialogue, mailbox. *(Done, kept as an easter egg.)*
4. **Living world** — guestbook and ghost visitors.
