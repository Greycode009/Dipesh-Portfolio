# Dipesh Malla — Portfolio

Personal portfolio, being rebuilt as a pixel-game world backed by a CMS.

## Structure

    frontend/   React + Vite + TypeScript + Tailwind  → Vercel
    backend/    Express + Sequelize + PostgreSQL      → Render

### frontend

    src/
      api/        HTTP seams for dynamic features (contact, later guestbook/presence)
      game/       The room: sprites, tile map, engine, in-world panels
      components/ Shared UI
      content/    ContentProvider — hands CMS content to the whole app
      context/    React context providers
      hooks/
      pages/      One file per route
      styles/     Tailwind entry + theme tokens
      types/      Shapes shared with the API

Motion is GSAP with ScrollTrigger (`src/lib/animations.ts`) plus Lenis for
interpolated scrolling. It runs by default for everyone, including visitors
whose system asks for reduced motion — a deliberate choice, paired with the
thing that makes it defensible: a Motion toggle in the footer of every page,
remembered across visits. Turning it off reverts every animation immediately
and hands scrolling back to the browser.

Animations do not initialise while the page is hidden. Applying their start
states in a background tab would hide the content and then freeze, because
requestAnimationFrame is throttled there.

The design is neo-brutalist: a warm paper ground, white cards outlined in
heavy ink with hard offset shadows and no blur, pill-shaped tags, chunky
uppercase display type (Archivo Black) with monospace labels (JetBrains Mono),
and one loud accent — electric violet. Dark mode inverts the ink: paper-white
borders and shadows on near-black.

Shared pieces live in the `@layer components` block of `src/styles/index.css`
as `nb-*` classes (`nb-box`, `nb-shadow`, `nb-card`, `nb-btn`, `nb-pill`,
`nb-press`, `nb-mark`), so the look is defined once rather than repeated as
long class strings.

A pixel town lives at `/room` as an easter egg, loaded only when asked for. A
project's house is built from its row in the projects table, so publishing one
puts a house on the street. Sprites are authored in code as grids of palette
characters (`src/game/sprites.ts`) and rasterised to canvas at startup — there
are no image assets and nothing to license. The map is generated in
`src/game/townMap.ts` rather than hand-typed, and the camera scrolls a 24x16
window over 56x40 tiles.

Styling is Tailwind only. Theme colours are CSS custom properties holding
space-separated RGB channels, so opacity modifiers (`bg-primary/10`) work
against whichever theme is active. There are two — light and dark, the
same violet accent on paper or charcoal — switched via the `data-theme` attribute on
`<html>`. A visitor with no stored preference follows their operating system,
and an inline script in `index.html` applies the theme before first paint so
the prerendered page never flashes the wrong one.

## Running

    cd frontend
    npm install
    cp .env.example .env.local   # VITE_API_URL, EmailJS credentials
    npm run dev                  # http://localhost:3000
    npm run build                # client build, SSR build, prerender each route
    npm run typecheck

The backend has to be running for either `dev` or `build` to have any content
to show: `npm run dev --prefix backend`.

Editing content: sign in at `/admin` and save. That is the whole loop — there
is no regeneration step and no rebuild. The database is the only copy of the
content; the build embeds a snapshot in the prerendered HTML so the first paint
is real text, and the browser refetches on load so an edit is live on reload.
If the API cannot be reached and no snapshot was embedded, the page says so
rather than rendering empty.

`npm run build` writes one static HTML file per route in `src/routes.ts`
(`dist/about/index.html`, and so on), each with its own title, description,
canonical and Open Graph tags. Note that `npm run preview` does *not* serve
those files — it falls back to `dist/index.html` for every path, so a route
other than `/` will look wrong locally. Inspect the generated files directly,
or deploy, to check prerendering.

## Deployment

Full walkthrough in [DEPLOYMENT.md](DEPLOYMENT.md). The two settings that catch
people out:

- The Vercel project's **Root Directory** must be `frontend`, since the app no
  longer lives at the repository root.
- **`VITE_API_URL`** must point at the deployed API. It is compiled in at build
  time, so changing it needs a fresh deploy.

`frontend/vercel.json` supplies the SPA rewrite that client-side routing needs —
as a fallback only, since Vercel checks the filesystem before applying
rewrites, so the prerendered per-route files win.

## Roadmap

1. **Foundations** — Vite + TypeScript, Tailwind-only styling, content extracted, routes prerendered. *(this branch)*
2. **CMS** — Express + Sequelize + Postgres, admin UI at `/admin`, GitHub
   project import. *(Image upload and migrations still to come.)*
3. **The Town** — pixel world at `/room`: a house per project, a library, a post office, a park. *(Done, kept as an easter egg.)*
4. **Living world** — public wall and anonymous live chat done; ghost visitors still to come.
