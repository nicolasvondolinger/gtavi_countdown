import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

// Starts every run from an empty test database.
export default async function setup() {
  const url = process.env.TEST_DATABASE_URL ?? 'postgres://gtawiki:gtawiki@localhost:5434/gtawiki_test';
  const client = postgres(url, { max: 1, onnotice: () => {} });
  await client`DROP SCHEMA IF EXISTS public CASCADE`;
  await client`DROP SCHEMA IF EXISTS drizzle CASCADE`;
  await client`CREATE SCHEMA public`;
  await migrate(drizzle(client), { migrationsFolder: './drizzle' });
  await client.end();
}
