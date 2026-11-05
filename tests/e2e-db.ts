import { execSync } from 'node:child_process';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

// Browser tests sign up, post and edit, so they get a database of their own, rebuilt on every run.
const url = new URL(process.env.DATABASE_URL!);
const name = url.pathname.slice(1);
if (!name.endsWith('_e2e')) throw new Error(`Refusing to reset ${name}: this script only resets the e2e database.`);

const admin = postgres(new URL('/postgres', url).href, { max: 1, onnotice: () => {} });
await admin`SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = ${name} AND pid <> pg_backend_pid()`;
await admin.unsafe(`DROP DATABASE IF EXISTS "${name}"`);
await admin.unsafe(`CREATE DATABASE "${name}"`);
await admin.end();

const client = postgres(url.href, { max: 1, onnotice: () => {} });
await migrate(drizzle(client), { migrationsFolder: './drizzle' });
await client.end();
execSync('npx tsx src/server/db/seed-sample.ts', { stdio: 'inherit' });
