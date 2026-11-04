import { describe, expect, it } from 'vitest';
import { db, schema } from '@/server/db';
import { seedFacts } from '@/server/db/seed';

describe('database', () => {
  it('seeds every game once, even when run twice', async () => {
    await seedFacts();
    await seedFacts();
    expect(await db.$count(schema.games)).toBe(14);
  });
});
