import { and, asc, desc, eq, inArray, sql, type SQL } from 'drizzle-orm';
import { db, schema } from '@/server/db';
import { nest } from '@/server/wiki/community';

const { channels, threads, tags, threadTags, profiles, posts, threadPages, pages, games } = schema;

export type Sort = 'hot' | 'new' | 'top';

const ORDER: Record<Sort, SQL> = {
  hot: sql`${threads.score} / power(extract(epoch from now() - ${threads.createdAt}) / 3600 + 2, 1.5) DESC`,
  new: sql`${threads.createdAt} DESC`,
  top: sql`${threads.score} DESC`,
};

export async function getChannels() {
  return db
    .select({ id: channels.id, slug: channels.slug, name: channels.name, description: channels.description, count: sql<number>`(select count(*)::int from ${threads} where ${threads.channelId} = ${channels.id})` })
    .from(channels)
    .orderBy(asc(channels.sortOrder));
}

export async function getTags() {
  return db.select().from(tags).orderBy(asc(tags.slug));
}

export async function getThreads(channelId: number, { sort = 'hot', tag, q, limit = 40 }: { sort?: Sort; tag?: string; q?: string; limit?: number } = {}) {
  const conds: SQL[] = [eq(threads.channelId, channelId)];
  if (tag) conds.push(sql`exists (select 1 from ${threadTags} join ${tags} on ${tags.id} = ${threadTags.tagId} where ${threadTags.threadId} = ${threads.id} and ${tags.slug} = ${tag})`);
  if (q) conds.push(sql`(${threads.search} @@ websearch_to_tsquery('english', ${q}) OR ${threads.title} ILIKE ${`%${q}%`})`);
  const rows = await db
    .select({ id: threads.id, title: threads.title, slug: threads.slug, image: threads.image, spoiler: threads.spoiler, pinned: threads.pinned, score: threads.score, replyCount: threads.replyCount, createdAt: threads.createdAt, author: profiles.username, avatar: profiles.avatar, role: profiles.role })
    .from(threads)
    .leftJoin(profiles, eq(threads.authorId, profiles.userId))
    .where(and(...conds))
    .orderBy(desc(threads.pinned), ORDER[sort])
    .limit(limit);
  const ids = rows.map(r => r.id);
  const tagRows = ids.length ? await db.select({ threadId: threadTags.threadId, slug: tags.slug }).from(threadTags).innerJoin(tags, eq(threadTags.tagId, tags.id)).where(inArray(threadTags.threadId, ids)) : [];
  return rows.map(r => ({ ...r, tags: tagRows.filter(t => t.threadId === r.id).map(t => t.slug) }));
}

export async function getThread(channelSlug: string, slug: string) {
  const [row] = await db
    .select({ thread: threads, channel: channels, author: profiles.username, avatar: profiles.avatar, role: profiles.role })
    .from(threads)
    .innerJoin(channels, eq(threads.channelId, channels.id))
    .leftJoin(profiles, eq(threads.authorId, profiles.userId))
    .where(and(eq(channels.slug, channelSlug), eq(threads.slug, slug)))
    .limit(1);
  if (!row) return null;
  const [threadTagRows, related, replies] = await Promise.all([
    db.select({ slug: tags.slug }).from(threadTags).innerJoin(tags, eq(threadTags.tagId, tags.id)).where(eq(threadTags.threadId, row.thread.id)),
    db.select({ title: pages.title, image: pages.image, section: pages.section, slug: pages.slug, gameSlug: games.slug }).from(threadPages).innerJoin(pages, eq(threadPages.pageId, pages.id)).innerJoin(games, eq(pages.gameId, games.id)).where(eq(threadPages.threadId, row.thread.id)),
    db.select({ id: posts.id, parentId: posts.parentId, body: posts.body, spoiler: posts.spoiler, score: posts.score, createdAt: posts.createdAt, author: profiles.username, avatar: profiles.avatar, role: profiles.role }).from(posts).leftJoin(profiles, eq(posts.authorId, profiles.userId)).where(eq(posts.threadId, row.thread.id)).orderBy(desc(posts.score), asc(posts.createdAt)),
  ]);
  return { ...row, tags: threadTagRows.map(t => t.slug), related, replies: nest(replies) };
}
