import { eq } from 'drizzle-orm';
import { beforeAll, describe, expect, it } from 'vitest';
import { db, schema } from '@/server/db';
import { seedFacts } from '@/server/db/seed';
import { ReviewError, castReviewVote, createRevision } from '@/server/wiki/review';

const { profiles, user, pages, revisions } = schema;
const reviewers = ['r1', 'r2', 'r3', 'r4', 'r5', 'r6'];
let n = 0;

async function freshPage() {
  const [game] = await db.select().from(schema.games).limit(1);
  const slug = `test-${++n}`;
  const [page] = await db.insert(pages).values({ gameId: game!.id, section: 'lore', slug, title: slug }).returning();
  const [rev] = await db.insert(revisions).values({ pageId: page!.id, body: 'start', summary: 'start', sourceKind: 'none', state: 'accepted' }).returning();
  await db.update(pages).set({ currentRevisionId: rev!.id }).where(eq(pages.id, page!.id));
  return { pageId: page!.id, baseRevisionId: rev!.id };
}
const rep = async (id: string) => (await db.select().from(profiles).where(eq(profiles.userId, id)))[0]!.rep;
const current = async (id: number) => (await db.select().from(pages).where(eq(pages.id, id)))[0]!.currentRevisionId;
const edit = (ids: { pageId: number; baseRevisionId: number }, over = {}) => createRevision({ ...ids, authorId: 'author', body: 'changed', summary: 'a change', sourceKind: 'community', source: 'Forum thread', ...over });

beforeAll(async () => {
  await seedFacts();
  for (const id of ['author', 'member', ...reviewers]) {
    await db.insert(user).values({ id, name: id, email: `${id}@example.invalid` }).onConflictDoNothing();
    await db.insert(profiles).values({ userId: id, username: `user_${id}`, rep: id.startsWith('r') ? 1000 : 0 }).onConflictDoNothing();
  }
});

describe('translations', () => {
  const official = { sourceKind: 'official', source: 'https://www.rockstargames.com/newswire/article/1', locale: 'pt' };
  const row = async (id: number) => (await db.select().from(pages).where(eq(pages.id, id)))[0]!;

  it('keeps each language on its own current text', async () => {
    const ids = await freshPage();
    const pt = await edit(ids, official);
    const page = await row(ids.pageId);
    expect(page.currentRevisionPt).toBe(pt.id);
    expect(page.currentRevisionId).toBe(ids.baseRevisionId);
  });

  it('checks a Portuguese edit against the Portuguese text', async () => {
    const ids = await freshPage();
    const pt = await edit(ids, official);
    await expect(edit(ids, { ...official, body: 'stale' })).rejects.toThrow(ReviewError);
    const next = await edit({ ...ids, baseRevisionId: pt.id }, { ...official, body: 'newer' });
    expect((await row(ids.pageId)).currentRevisionPt).toBe(next.id);
  });

  it('publishes a reviewed translation in its own language', async () => {
    const ids = await freshPage();
    const pt = await edit(ids, { locale: 'pt' });
    for (const id of reviewers.slice(0, 5)) await castReviewVote(pt.id, id, 'keep');
    const page = await row(ids.pageId);
    expect(page.currentRevisionPt).toBe(pt.id);
    expect(page.currentRevisionId).toBe(ids.baseRevisionId);
  });
});

describe('creating edits', () => {
  it('publishes an edit with a verifiable official source at once', async () => {
    const ids = await freshPage();
    const r = await edit(ids, { sourceKind: 'official', source: 'https://www.rockstargames.com/newswire/article/1' });
    expect(r.state).toBe('accepted');
    expect(await current(ids.pageId)).toBe(r.id);
  });

  it('refuses to treat a non-official link as official', async () => {
    const ids = await freshPage();
    await expect(edit(ids, { sourceKind: 'official', source: 'https://reddit.com/r/GTA6' })).rejects.toThrow(ReviewError);
  });

  it('keeps the article unchanged while an edit is pending', async () => {
    const ids = await freshPage();
    const r = await edit(ids);
    expect(r.state).toBe('pending');
    expect(await current(ids.pageId)).toBe(ids.baseRevisionId);
  });

  it('rejects an edit based on an outdated revision', async () => {
    const ids = await freshPage();
    await edit(ids, { sourceKind: 'official', source: 'https://rockstargames.com/a' });
    await expect(edit(ids, { body: 'other' })).rejects.toThrow(/changed while you were editing/);
  });

  it('allows one pending edit per author on a page', async () => {
    const ids = await freshPage();
    await edit(ids);
    await expect(edit(ids, { body: 'second' })).rejects.toThrow(/already have an edit/);
  });
});

describe('reviewing edits', () => {
  it('stays pending until the fifth vote, then accepts and pays once', async () => {
    const ids = await freshPage();
    const r = await edit(ids);
    const before = await rep('author');
    for (const id of reviewers.slice(0, 4)) expect((await castReviewVote(r.id, id, 'keep')).state).toBe('pending');
    expect(await current(ids.pageId)).toBe(ids.baseRevisionId);
    expect((await castReviewVote(r.id, 'r5', 'keep')).state).toBe('accepted');
    expect(await current(ids.pageId)).toBe(r.id);
    expect(await rep('author')).toBe(before + 10);
    await expect(castReviewVote(r.id, 'r6', 'keep')).rejects.toThrow(/already closed/);
    expect(await rep('author')).toBe(before + 10);
  });

  it('reverts on a majority against and takes reputation away', async () => {
    const ids = await freshPage();
    const r = await edit(ids);
    const before = await rep('author');
    const votes = ['revert', 'revert', 'revert', 'keep', 'keep'] as const;
    let last;
    for (const [i, v] of votes.entries()) last = await castReviewVote(r.id, reviewers[i]!, v);
    expect(last!.state).toBe('reverted');
    expect(await current(ids.pageId)).toBe(ids.baseRevisionId);
    expect(await rep('author')).toBe(before - 15);
  });

  it('counts a changed vote once', async () => {
    const ids = await freshPage();
    const r = await edit(ids);
    await castReviewVote(r.id, 'r1', 'keep');
    expect((await castReviewVote(r.id, 'r1', 'revert')).votes).toBe(1);
  });

  it('stops the author and low-rep members from voting', async () => {
    const ids = await freshPage();
    const r = await edit(ids);
    await expect(castReviewVote(r.id, 'author', 'keep')).rejects.toThrow(/own edit/);
    await expect(castReviewVote(r.id, 'member', 'keep')).rejects.toThrow(/500 rep/);
  });

  it('closes a review without erasing newer text or moving reputation', async () => {
    const ids = await freshPage();
    const r = await edit(ids);
    const newer = await edit(ids, { sourceKind: 'official', source: 'https://rockstargames.com/b', body: 'newer' });
    const before = await rep('author');
    let last;
    for (const id of reviewers.slice(0, 5)) last = await castReviewVote(r.id, id, 'keep');
    expect(last).toMatchObject({ state: 'reverted', stale: true });
    expect(await current(ids.pageId)).toBe(newer.id);
    expect(await rep('author')).toBe(before);
  });

  it('handles the fifth and sixth votes arriving together', async () => {
    const ids = await freshPage();
    const r = await edit(ids);
    const before = await rep('author');
    for (const id of reviewers.slice(0, 4)) await castReviewVote(r.id, id, 'keep');
    await Promise.allSettled([castReviewVote(r.id, 'r5', 'keep'), castReviewVote(r.id, 'r6', 'keep')]);
    expect(await rep('author')).toBe(before + 10);
  });
});
