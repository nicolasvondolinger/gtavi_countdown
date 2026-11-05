import { eq } from 'drizzle-orm';
import { beforeAll, describe, expect, it } from 'vitest';
import { getModCatalog, validateChoices } from '@/server/database/queries';
import { db, schema } from '@/server/db';
import { seedFacts } from '@/server/db/seed';
import { createPost, createThread } from '@/server/forum/service';
import { getThread, getThreads } from '@/server/forum/queries';
import { getMarkers } from '@/server/map/queries';

let gameId: number;
let channelId: number;

beforeAll(async () => {
  const ids = await seedFacts();
  gameId = ids['gta-6']!;
  channelId = (await db.select().from(schema.channels).where(eq(schema.channels.slug, 'general')))[0]!.id;
  await db.insert(schema.user).values({ id: 'poster', name: 'poster', email: 'poster@example.invalid' }).onConflictDoNothing();
  await db.insert(schema.mapMarkers).values({ gameId, layer: 'mission', title: 'Hidden mission', x: 0.5, y: 0.5, visibleFrom: new Date('2026-11-19T00:00:00Z') });
});

describe('map markers', () => {
  it('hides markers until their date', async () => {
    const before = await getMarkers(gameId, new Date('2026-11-18T23:59:00Z'));
    expect(before.some(m => m.title === 'Hidden mission')).toBe(false);
    const after = await getMarkers(gameId, new Date('2026-11-19T00:00:01Z'));
    expect(after.some(m => m.title === 'Hidden mission')).toBe(true);
  });
  it('links region markers to their article', async () => {
    const vice = (await getMarkers(gameId)).find(m => m.title === 'Vice City');
    expect(vice?.href).toBe('/gta-6/locations/vice-city');
  });
});

describe('forum', () => {
  it('gives threads with the same title different slugs, and counts replies', async () => {
    const input = { channelId, authorId: 'poster', title: 'The same title twice', body: 'Some detail here', spoiler: false, tagSlugs: ['theory'] };
    const a = await createThread(input);
    const b = await createThread(input);
    expect(a.slug).not.toBe(b.slug);
    const top = await createPost({ threadId: a.id, authorId: 'poster', body: 'first', spoiler: false });
    await createPost({ threadId: a.id, parentId: top.id, authorId: 'poster', body: 'nested', spoiler: true });
    const thread = await getThread('general', a.slug);
    expect(thread?.thread.replyCount).toBe(2);
    expect(thread?.replies).toHaveLength(1);
    expect(thread?.replies[0]?.replies[0]?.spoiler).toBe(true);
    expect(thread?.tags).toEqual(['theory']);
  });
  it('filters by tag and keeps pinned threads first', async () => {
    await createThread({ channelId, authorId: 'poster', title: 'An untagged thread here', body: 'Some detail here', spoiler: false, tagSlugs: [] });
    const tagged = await getThreads(channelId, { tag: 'theory' });
    expect(tagged.every(t => t.tags.includes('theory'))).toBe(true);
    const [first] = await db.select().from(schema.threads).where(eq(schema.threads.channelId, channelId));
    await db.update(schema.threads).set({ pinned: true }).where(eq(schema.threads.id, first!.id));
    expect((await getThreads(channelId, { sort: 'new' }))[0]?.id).toBe(first!.id);
  });
});

describe('builds', () => {
  it('rejects a mod that belongs to another category', async () => {
    const [engine] = await db.insert(schema.modCategories).values({ slug: 'test-a', name: 'A', sortOrder: 90 }).returning();
    const [other] = await db.insert(schema.modCategories).values({ slug: 'test-b', name: 'B', sortOrder: 91 }).returning();
    const [optionA] = await db.insert(schema.modOptions).values({ categoryId: engine!.id, name: 'a', price: 1, sortOrder: 0 }).returning();
    await db.insert(schema.modOptions).values({ categoryId: other!.id, name: 'b', price: 1, sortOrder: 0 });
    expect(await validateChoices({ 'test-a': optionA!.id })).toHaveLength(1);
    expect(await validateChoices({ 'test-b': optionA!.id })).toBeNull();
    expect((await getModCatalog()).find(c => c.slug === 'test-a')?.options).toHaveLength(1);
  });
});
