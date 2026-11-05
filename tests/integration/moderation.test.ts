import { eq } from 'drizzle-orm';
import { beforeAll, describe, expect, it } from 'vitest';
import { db, schema } from '@/server/db';
import { seedFacts } from '@/server/db/seed';
import { getReports, report, resolveReport, setPinned, setRole } from '@/server/moderation/service';
import { createStory } from '@/server/news/service';
import { createPost, createThread } from '@/server/forum/service';
import { getNotifications, markAllRead, unreadCount } from '@/server/notifications';
import { getComments, createComment } from '@/server/wiki/community';
import { getThread } from '@/server/forum/queries';

let pageId: number;
let channelId: number;

beforeAll(async () => {
  await seedFacts();
  [pageId] = (await db.select({ id: schema.pages.id }).from(schema.pages).limit(1)).map(p => p.id) as [number];
  channelId = (await db.select().from(schema.channels).where(eq(schema.channels.slug, 'modding')))[0]!.id;
  for (const id of ['mod1', 'alice', 'bob']) {
    await db.insert(schema.user).values({ id, name: id, email: `${id}@example.invalid` }).onConflictDoNothing();
    await db.insert(schema.profiles).values({ userId: id, username: `m_${id}`, onboardedAt: new Date() }).onConflictDoNothing();
  }
});

describe('notifications', () => {
  it('tells a thread author about a reply, but not about their own', async () => {
    const thread = await createThread({ channelId, authorId: 'alice', title: 'A thread for notifications', body: 'Some detail here', spoiler: false, tagSlugs: [] });
    const before = await unreadCount('alice');
    await createPost({ threadId: thread.id, authorId: 'alice', body: 'my own reply', spoiler: false });
    expect(await unreadCount('alice')).toBe(before);
    await createPost({ threadId: thread.id, authorId: 'bob', body: 'a reply', spoiler: false });
    expect(await unreadCount('alice')).toBe(before + 1);
    expect((await getNotifications('alice'))[0]?.href).toContain(thread.slug);
    await markAllRead('alice');
    expect(await unreadCount('alice')).toBe(0);
  });

  it('tells a comment author about a reply', async () => {
    const parent = await createComment({ pageId, authorId: 'alice', body: 'a comment', path: '/gta-5/lore/x' });
    await createComment({ pageId, parentId: parent.id, authorId: 'bob', body: 'an answer', path: '/gta-5/lore/x' });
    expect(await unreadCount('alice')).toBe(1);
  });
});

describe('moderation', () => {
  it('counts one report per person and shows it in the queue', async () => {
    const c = await createComment({ pageId, authorId: 'bob', body: 'something rude', path: '/x' });
    expect(await report('comment', c.id, 'alice')).toBe(true);
    expect(await report('comment', c.id, 'alice')).toBe(false);
    expect((await getReports()).find(r => r.id === c.id)?.reports).toBe(1);
  });

  it('hides removed comments and clears them from the queue', async () => {
    const c = await createComment({ pageId, authorId: 'bob', body: 'remove me please', path: '/x' });
    await report('comment', c.id, 'alice');
    await resolveReport('comment', c.id, 'mod1', 'remove');
    expect((await getReports()).some(r => r.id === c.id)).toBe(false);
    expect((await getComments(pageId)).find(n => n.id === c.id)?.body).toBe('[removed by a moderator]');
    expect(await db.$count(schema.moderationLog)).toBeGreaterThan(0);
  });

  it('hides removed forum replies too', async () => {
    const t = await createThread({ channelId, authorId: 'alice', title: 'A thread for removal', body: 'Some detail here', spoiler: false, tagSlugs: [] });
    const p = await createPost({ threadId: t.id, authorId: 'bob', body: 'bad reply', spoiler: false });
    await report('post', p.id, 'alice');
    await resolveReport('post', p.id, 'mod1', 'remove');
    expect((await getThread('modding', t.slug))?.replies[0]?.body).toBe('[removed by a moderator]');
  });

  it('keeps content when a report is dismissed', async () => {
    const c = await createComment({ pageId, authorId: 'bob', body: 'this is fine', path: '/x' });
    await report('comment', c.id, 'alice');
    await resolveReport('comment', c.id, 'mod1', 'dismiss');
    expect((await getComments(pageId)).find(n => n.id === c.id)?.body).toBe('this is fine');
  });

  it('pins threads and sets roles', async () => {
    const t = await createThread({ channelId, authorId: 'alice', title: 'A thread to pin here', body: 'Some detail here', spoiler: false, tagSlugs: [] });
    await setPinned(t.id, true, 'mod1');
    expect((await getThread('modding', t.slug))?.thread.pinned).toBe(true);
    expect(await setRole('M_Bob', 'reviewer', 'mod1')).toBe(true);
    expect(await setRole('nobody_here', 'reviewer', 'mod1')).toBe(false);
  });
});

describe('news', () => {
  it('gives stories with the same title different slugs', async () => {
    const input = { gameId: null, title: 'The same headline twice', excerpt: 'A summary', body: 'The story', status: 'official' as const, source: 'Rockstar Games', image: null, sponsored: false };
    expect((await createStory(input)).slug).not.toBe((await createStory(input)).slug);
  });
});
