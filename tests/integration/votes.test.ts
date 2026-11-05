import { eq } from 'drizzle-orm';
import { beforeAll, describe, expect, it } from 'vitest';
import { db, schema } from '@/server/db';
import { seedFacts } from '@/server/db/seed';
import { myVotes, vote } from '@/server/votes';

let theoryId: number;

beforeAll(async () => {
  await seedFacts();
  await db.insert(schema.user).values({ id: 'voter', name: 'voter', email: 'voter@example.invalid' }).onConflictDoNothing();
  const [page] = await db.select().from(schema.pages).limit(1);
  const [t] = await db.insert(schema.theories).values({ pageId: page!.id, title: 'A theory for tests', body: 'Reasoning' }).returning();
  theoryId = t!.id;
});

const theory = async () => (await db.select().from(schema.theories).where(eq(schema.theories.id, theoryId)))[0]!;

describe('votes', () => {
  it('counts one vote, lets it change, and takes it back', async () => {
    expect(await vote('theory', theoryId, 'voter', 1)).toEqual({ score: 1, mine: 1 });
    expect(await theory()).toMatchObject({ plausibleVotes: 1, totalVotes: 1 });
    expect(await vote('theory', theoryId, 'voter', -1)).toEqual({ score: -1, mine: -1 });
    expect(await theory()).toMatchObject({ plausibleVotes: 0, totalVotes: 1 });
    expect(await vote('theory', theoryId, 'voter', -1)).toEqual({ score: 0, mine: 0 });
    expect(await theory()).toMatchObject({ plausibleVotes: 0, totalVotes: 0 });
  });

  it('reports what the viewer voted', async () => {
    await vote('theory', theoryId, 'voter', 1);
    expect(await myVotes('voter', { theory: [theoryId] })).toEqual({ [`theory:${theoryId}`]: 1 });
  });
});
