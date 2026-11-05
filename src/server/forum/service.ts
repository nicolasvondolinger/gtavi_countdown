import { eq, inArray, sql } from 'drizzle-orm';
import { slugify } from '@/lib/toc';
import { db, schema } from '@/server/db';

const { threads, threadTags, tags, posts } = schema;

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
    return post!;
  });
}
