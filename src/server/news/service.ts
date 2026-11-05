import { eq } from 'drizzle-orm';
import { slugify } from '@/lib/toc';
import { db, schema } from '@/server/db';

const { news } = schema;

export type StoryInput = {
  i18n?: { pt?: { title?: string; excerpt?: string; body?: string } };
  gameId: number | null; title: string; excerpt: string; body: string; status: 'official' | 'leak' | 'theory' | null; source: string; image: string | null; sponsored: boolean };

export async function createStory(input: StoryInput) {
  const base = slugify(input.title).slice(0, 70) || 'story';
  const taken = await db.$count(news, eq(news.slug, base));
  const [story] = await db.insert(news).values({ ...input, slug: taken ? `${base}-${Date.now().toString(36)}` : base }).returning();
  return story!;
}

export async function updateStory(id: number, input: StoryInput) {
  await db.update(news).set(input).where(eq(news.id, id));
}
