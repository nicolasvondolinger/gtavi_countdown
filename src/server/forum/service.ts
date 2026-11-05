import { eq, inArray, sql } from 'drizzle-orm';
import { slugify } from '@/lib/toc';
import { db, schema } from '@/server/db';
import { notify } from '@/server/notifications';

const { threads, threadTags, tags, posts, channels } = schema;

export async function createThread(input: { channelId: number; authorId: string; title: string; body: string; spoiler: boolean; tagSlugs: string[] }) {
  const { tagSlugs, ...values } = input;
  return db.transaction(async tx => {
    const base = slugify(values.title).slice(0, 60) || 'thread';
    const taken = await tx.$count(threads, sql`${threads.channelId} = ${values.channelId} AND ${threads.slug} LIKE ${`${base}%`}`);
    const [thread] = await tx.insert(threads).values({ ...values, slug: taken ? `${base}-${taken + 1}` : base }).returning();
    if (tagSlugs.length) {
      const found = await tx.select().from(tags).where(inArray(tags.slug, tagSlugs));
      if (found.length) await tx.insert(threadTags).values(found.map(t => ({ threadId: thread!.id, tagId: t.id })));
    }
    return thread!;
  });
}

export async function createPost(input: { threadId: number; parentId?: number; authorId: string; body: string; spoiler: boolean }) {
  return db.transaction(async tx => {
    const [post] = await tx.insert(posts).values(input).returning();
    await tx
      .update(threads)
      .set({ replyCount: sql`${threads.replyCount} + 1`, lastActivityAt: new Date() })
      .where(eq(threads.id, input.threadId));
    const [thread] = await tx.select({ authorId: threads.authorId, slug: threads.slug, title: threads.title, channel: channels.slug }).from(threads).innerJoin(channels, eq(threads.channelId, channels.id)).where(eq(threads.id, input.threadId));
    const href = `/forums/${thread!.channel}/${thread!.slug}`;
    const [parent] = input.parentId ? await tx.select({ authorId: posts.authorId }).from(posts).where(eq(posts.id, input.parentId)) : [];
    await notify(tx, { userId: thread!.authorId, actorId: input.authorId, title: `New reply in ${thread!.title}`, href });
    if (parent?.authorId !== thread!.authorId) await notify(tx, { userId: parent?.authorId ?? null, actorId: input.authorId, title: `Someone replied to you in ${thread!.title}`, href });
    return post!;
  });
}
