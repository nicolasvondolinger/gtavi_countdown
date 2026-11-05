import { existsSync } from 'node:fs';
import path from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';
import { db, schema } from '@/server/db';
import { seedFacts } from '@/server/db/seed';

const missing = (files: (string | null)[]) => files.filter((f): f is string => !!f).filter(f => !existsSync(path.join('public', 'media', f)));

describe('seeded media', () => {
  beforeAll(seedFacts, 30_000);

  it('points at files that exist', async () => {
    const [games, pages, news, vehicles, markers] = await Promise.all([db.select().from(schema.games), db.select().from(schema.pages), db.select().from(schema.news), db.select().from(schema.vehicles), db.select().from(schema.mapMarkers)]);
    expect(missing(games.flatMap(g => [g.image, ...g.gallery]))).toEqual([]);
    expect(missing(pages.flatMap(p => [p.image, ...p.gallery]))).toEqual([]);
    expect(missing([...news.map(n => n.image), ...vehicles.map(v => v.image), ...markers.map(m => m.image)])).toEqual([]);
  });
});
