# Deployment

The site is two deployments plus a database:

| Piece | Host | What it is |
| --- | --- | --- |
| Database | Neon | Postgres. Already created and holding the real content. |
| API | Render | Express. The admin UI, the guestbook and the chat all talk to it. |
| Frontend | Vercel | The static site, built from `frontend/`. |

**The API goes first.** The frontend build calls the API and bakes the content
into the HTML, so it cannot be built until the API has a public URL. Until then
Vercel builds will fail — deliberately, rather than shipping blank pages — and
the previous deployment stays live in the meantime.

---

## 0. Rotate the Neon password first

The current connection string was pasted in plain text and should not be the
one that goes live. In the Neon console, reset the password for the
`neondb_owner` role, then use the new connection string everywhere below —
including your local `backend/.env`.

## 1. API on Render

`render.yaml` in the repository root describes the service, so Render can read
it rather than you filling in a form.

1. Render dashboard → **New → Blueprint** → pick this repository, branch
   `main`. The blueprint fills in the settings below; they are listed in case
   you create the service by hand instead.

   | Setting | Value |
   | --- | --- |
   | Root Directory | `backend` |
   | Build Command | `npm ci --include=dev && npm run build` |
   | Start Command | `npm start` |
   | Health Check Path | `/health` |

   `--include=dev` is load-bearing. `NODE_ENV=production` applies during the
   build as well as at runtime, and npm then skips devDependencies — where
   `typescript` and `tsc-alias` live. Without it the build fails with
   `tsc: not found`.
2. Render reads `render.yaml` and asks for the values it will not read from
   version control:

   | Variable | Value |
   | --- | --- |
   | `DATABASE_URL` | The new Neon connection string from step 0. |
   | `CORS_ORIGINS` | `https://dipeshmalla.vercel.app` — add any custom domain, comma separated. |
   | `GITHUB_TOKEN` | Optional. Raises the GitHub import limit from 60 to 5000 requests an hour. |

   `NODE_ENV=production` is set in the blueprint, and `JWT_SECRET` is generated
   by Render so it never passes through the repository.

3. Deploy. When it finishes, check the URL Render gives you:

   ```bash
   curl https://portfolio-api-XXXX.onrender.com/health
   ```

   It should answer `{"ok":true,"env":"production"}`.

### The database schema already exists

The server only runs `sequelize.sync()` outside production, so deploying will
not create or alter tables. It does not need to: the schema and the content are
already in Neon.

The catch is that **a future schema change will not apply itself**. After
adding or changing a column you have to run the sync against Neon yourself,
from your machine, with `DATABASE_URL` pointing at Neon and `NODE_ENV` unset:

```bash
npm run db:sync --prefix backend
```

This is the weakest part of the setup and the thing most worth replacing with
real migrations before the content gets any more valuable.

### What the free tier costs you

A free Render service sleeps after about 15 minutes with no traffic. The next
request wakes it, which takes roughly a minute. In practice:

- A visitor arriving cold sees the prerendered page immediately — that HTML is
  static and comes from Vercel — and the content refreshes once the API wakes.
- The admin UI, the guestbook and the chat all wait on that first request.
- Open chat connections drop when the service sleeps.

Moving to a paid instance later changes nothing but the plan.

## 2. Frontend on Vercel

In the existing Vercel project:

1. **Settings → General → Root Directory** → `frontend`.
   This is the one setting most likely to be wrong; without it Vercel builds
   the repository root and finds no app.
2. **Settings → Environment Variables** → add, for Production *and* Preview:

   | Variable | Value |
   | --- | --- |
   | `VITE_API_URL` | The Render URL, no trailing slash. |
   | `SITE_URL` | Only if you use a custom domain. Sets the canonical and OG URLs. |

3. Redeploy.

Framework preset, build command and output directory are detected from
`frontend/package.json` and `frontend/vercel.json`; there is nothing to change.

### `VITE_API_URL` is compiled in, not read at runtime

Vite replaces it at build time. Changing the API URL therefore needs a **fresh
Vercel deploy**, not just a restart. Editing *content* needs no deploy at all —
that is the whole point of the CMS, and it is the one thing that does update by
itself.

### A build that cannot reach the API fails

The prerenderer retries six times over about 75 seconds, which covers a Render
cold start. If it still cannot reach the API it fails the build rather than
quietly shipping blank pages. Locally it only warns, so you can build with the
API switched off.

## 3. After the first deploy

1. Confirm `CORS_ORIGINS` on Render exactly matches the live origin — scheme
   included, no trailing slash. A mismatch shows up as content that renders on
   first paint and then never refreshes.
2. Sign in at `https://<your-domain>/admin` and change something small. It
   should be live on reload, with no rebuild.
3. Post a chat message from two browsers to check the stream survives the proxy.

## Environment variables, all together

**Render (API)**

```
NODE_ENV=production
DATABASE_URL=<neon connection string>
JWT_SECRET=<generated by Render>
CORS_ORIGINS=https://dipeshmalla.vercel.app
GITHUB_TOKEN=<optional>
```

`PORT` is supplied by Render. `ADMIN_EMAIL` and `ADMIN_PASSWORD` are only read
by the seeder, which has already run, so they are not needed in production.

**Vercel (frontend)**

```
VITE_API_URL=https://portfolio-api-XXXX.onrender.com
SITE_URL=<only for a custom domain>
```
