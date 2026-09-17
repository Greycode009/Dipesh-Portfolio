# backend

Express + Sequelize + PostgreSQL CMS for the portfolio. No Docker.

## Structure

Feature-based — each feature owns its model, validation, routes and any
service logic:

    src/
      config/        env parsing, Sequelize instance
      shared/
        crud/        createCrudRouter — the REST surface every content type reuses
        errors/      AppError
        middleware/  authenticate, validate, errorHandler, asyncHandler
      features/
        auth/        login, /me, change-password
        projects/
        skills/
        timeline/
        socials/
        expertise/
        bio/         singleton, so no :id in its routes
        guestbook/   public writes, admin moderation
      db/            models registry, sync, seed
      app.ts         express app
      server.ts      entry point

## Database

PostgreSQL in production (Neon). With `DATABASE_URL` unset, it falls back to a
local SQLite file so the API runs without provisioning anything. Models
therefore stick to types both dialects support — arrays are `JSON` columns, not
Postgres `ARRAY`.

Schema is created with `sequelize.sync()` while it is still moving. Migrations
come once it settles; do not point `sync({ alter: true })` at production data.

## Running

    cd backend
    npm install
    cp .env.example .env    # set JWT_SECRET and ADMIN_PASSWORD
    npm run db:seed         # seeds content + creates the admin user
    npm run dev             # http://localhost:4000

    npm run build && npm start   # compiled
    npm run typecheck

`scripts/generate-seed.ts` regenerates `src/db/seed-data.json` from the
frontend's content modules. It was the one-time bridge from hardcoded content;
after seeding, the database is the source of truth.

## API

Reads are public, writes need `Authorization: Bearer <token>`. Anonymous
callers see only published projects and approved guestbook entries; an admin
token reveals drafts.

| Method | Path | Auth |
|---|---|---|
| POST | `/api/auth/login` | – (rate limited, 10 per 15 min) |
| GET | `/api/auth/me` | admin |
| POST | `/api/auth/change-password` | admin |
| GET | `/api/{projects,skills,timeline,socials,expertise}` | – |
| GET | `/api/{...}/:id` | – |
| POST | `/api/{...}` | admin |
| PATCH | `/api/{...}/:id` | admin |
| DELETE | `/api/{...}/:id` | admin |
| POST | `/api/{...}/reorder` | admin — body `{ ids: [3,1,2] }` |
| GET | `/api/bio` | – |
| PATCH | `/api/bio` | admin |
| GET | `/api/guestbook` | – (approved only) |
| POST | `/api/guestbook` | – (rate limited, 3 per hour; links refused) |
| PATCH | `/api/guestbook/:id` | admin — `{ approved: bool }` |
| DELETE | `/api/guestbook/:id` | admin |
| POST | `/api/github/preview` | admin — body `{ repo }`, returns an unsaved draft |
| POST | `/api/github/sync-stats` | admin — refreshes stars and last-commit dates |
| GET | `/api/chat` | – recent messages plus how many are connected |
| GET | `/api/chat/stream` | – server-sent events: message, deleted, presence |
| POST | `/api/chat` | – (rate limited, 12 per minute; links refused) |
| DELETE | `/api/chat/:id` | admin |
| GET | `/health` | – |

The chat is anonymous in the strong sense: no name is accepted, stored or
returned. Only the message body is kept, alongside a hashed address used for
rate limiting that never leaves the server. The table is pruned to the last 300
rows — it is a conversation, not an archive.

Guestbook messages are published immediately by default. Set
`GUESTBOOK_AUTO_APPROVE=false` to hold them for approval in the admin queue
instead; the API tells the client which happened, so it never shows a pending
message as though it were live.

`GITHUB_TOKEN` is optional; without it GitHub allows 60 requests an hour, with
it 5000. A classic token with no scopes is enough for public repositories.

## Deployment

Railway or Fly, not a free tier that sleeps — Phase 4's ghost visitors need a
persistent WebSocket, and a cold start would stall them. Set `DATABASE_URL`,
`JWT_SECRET`, `CORS_ORIGINS` and `NODE_ENV=production`.
