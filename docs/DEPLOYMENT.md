# Deploying GTA Wiki

The app is a Node server plus PostgreSQL. It cannot run on GitHub Pages.

## What is live today

The old countdown is still served by GitHub Pages from its last deploy. Pushing to `main` no longer changes it because the Pages workflow was removed. When the wiki is live, turn Pages off in the repository settings (Settings, Pages) or point the domain at the new host.

## Before launch

| Item | Status |
|---|---|
| Hosting and domain | Needs an account and a decision |
| Production PostgreSQL with backups | Needs an account |
| Google, Apple, Discord OAuth apps | Needs developer accounts; each provider stays hidden until its credentials are set |
| Email sending (password reset, verification) | Not built; needs a provider such as Resend |
| Ad network | Slots are placeholders |
| Privacy Policy and Terms | Drafts, need legal review |
| Rights to official artwork | Confirm before publishing |
| Sample data | Run only `db:seed` in production, never `db:seed:sample` |
| First reviewers | A new site has nobody with 500 rep, so edits cannot be reviewed. Set `role` to `reviewer` or `moderator` in `profiles` for at least five trusted people |

## Option A: VPS with Docker (Coolify or plain Compose)

1. Create a PostgreSQL 16 database with daily backups.
2. Set the secrets below.
3. Apply migrations and facts: `npm run db:migrate && npm run db:seed` with `DATABASE_URL` pointing at production.
4. Build: `docker build --build-arg DATABASE_URL=... --build-arg NEXT_PUBLIC_SITE_URL=https://your.domain -t gta-wiki .`
5. Run the container on port 3000 behind Cloudflare, which caches the pages and static assets.

## Option B: Vercel and Neon

Import the repo in Vercel, set the same variables, and use Neon for Postgres. Run the migrations from your machine or a release step.

## Secrets

| Variable | Notes |
|---|---|
| `DATABASE_URL` | Production Postgres |
| `BETTER_AUTH_SECRET` | `openssl rand -hex 32` |
| `BETTER_AUTH_URL` | Public URL of the site |
| `NEXT_PUBLIC_SITE_URL` | Same URL; used in the sitemap and structured data |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Optional |
| `DISCORD_CLIENT_ID`, `DISCORD_CLIENT_SECRET` | Optional |
| `APPLE_CLIENT_ID`, `APPLE_CLIENT_SECRET` | Optional |

OAuth redirect URL for each provider: `https://your.domain/api/auth/callback/<provider>`.

## Checks

`GET /api/health` returns 200 when the app can reach the database. `npm run test:e2e` runs the main flows.

## Backups and rollback

Keep daily database backups for 14 days and test a restore before launch. Roll back by redeploying the previous image; migrations only add to the schema so far.
