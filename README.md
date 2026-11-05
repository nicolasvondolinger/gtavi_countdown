# GTA Wiki

A fan-run wiki and forum for the whole Grand Theft Auto series. Not affiliated with Rockstar Games or Take-Two Interactive.

## Run it

```sh
npm install
cp .env.example .env        # then set BETTER_AUTH_SECRET
npm run db:up               # Postgres in Docker, port 5434
npm run db:migrate
npm run db:seed:sample      # facts plus sample community data
npm run dev
```

Checks: `npm run lint`, `npm run typecheck`, `npm test`, `npm run test:e2e`.

Docs: [architecture](docs/ARCHITECTURE.md), [deployment](docs/DEPLOYMENT.md), [design](design/DESIGN.md).
