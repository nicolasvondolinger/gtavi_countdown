import { and, desc, eq, sql } from 'drizzle-orm';
import { db, schema } from '@/server/db';

const { contentReports, comments, posts, threads, pages, games, channels, profiles, moderationLog } = schema;

export type ReportKind = 'comment' | 'post';
const TABLE = { comment: comments, post: posts } as const;

export async function report(kind: ReportKind, id: number, userId: string) {
  return db.transaction(async tx => {
    const added = await tx.insert(contentReports).values({ kind, targetId: id, userId }).onConflictDoNothing().returning();
    if (!added.length) return false;
    const t = TABLE[kind] as typeof comments;
    await tx.update(t).set({ reports: sql`${t.reports} + 1` }).where(eq(t.id, id));
    return true;
  });
}

export async function resolveReport(kind: ReportKind, id: number, moderatorId: string, action: 'dismiss' | 'remove') {
  await db.transaction(async tx => {
    const t = TABLE[kind] as typeof comments;
    await tx.delete(contentReports).where(and(eq(contentReports.kind, kind), eq(contentReports.targetId, id)));
    await tx.update(t).set({ reports: 0, ...(action === 'remove' ? { removed: true } : {}) }).where(eq(t.id, id));
    await tx.insert(moderationLog).values({ moderatorId, action, target: `${kind}:${id}` });
  });
}

export async function setPinned(threadId: number, pinned: boolean, moderatorId: string) {
  await db.transaction(async tx => {
    await tx.update(threads).set({ pinned }).where(eq(threads.id, threadId));
    await tx.insert(moderationLog).values({ moderatorId, action: pinned ? 'pin' : 'unpin', target: `thread:${threadId}` });
  });
}

export async function setRole(username: string, role: 'member' | 'reviewer' | 'moderator', moderatorId: string | null) {
  return db.transaction(async tx => {
    const changed = await tx.update(profiles).set({ role }).where(sql`lower(${profiles.username}) = ${username.toLowerCase()}`).returning({ id: profiles.userId });
    if (!changed.length) return false;
    await tx.insert(moderationLog).values({ moderatorId, action: `role:${role}`, target: `user:${changed[0]!.id}` });
    return true;
  });
}

export async function getReports() {
  const [commentRows, postRows] = await Promise.all([
    db
      .select({ id: comments.id, body: comments.body, reports: comments.reports, createdAt: comments.createdAt, author: profiles.username, gameSlug: games.slug, section: pages.section, slug: pages.slug })
      .from(comments)
      .innerJoin(pages, eq(comments.pageId, pages.id))
      .innerJoin(games, eq(pages.gameId, games.id))
      .leftJoin(profiles, eq(comments.authorId, profiles.userId))
      .where(sql`${comments.reports} > 0`)
      .orderBy(desc(comments.reports)),
    db
      .select({ id: posts.id, body: posts.body, reports: posts.reports, createdAt: posts.createdAt, author: profiles.username, thread: threads.slug, channel: channels.slug })
      .from(posts)
      .innerJoin(threads, eq(posts.threadId, threads.id))
      .innerJoin(channels, eq(threads.channelId, channels.id))
      .leftJoin(profiles, eq(posts.authorId, profiles.userId))
      .where(sql`${posts.reports} > 0`)
      .orderBy(desc(posts.reports)),
  ]);
  return [
    ...commentRows.map(c => ({ kind: 'comment' as const, id: c.id, body: c.body, reports: c.reports, author: c.author, createdAt: c.createdAt, href: `/${c.gameSlug}/${c.section}/${c.slug}#talk` })),
    ...postRows.map(p => ({ kind: 'post' as const, id: p.id, body: p.body, reports: p.reports, author: p.author, createdAt: p.createdAt, href: `/forums/${p.channel}/${p.thread}` })),
  ].sort((a, b) => b.reports - a.reports);
}
