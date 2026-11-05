import { and, asc, desc, eq, isNotNull, ne } from 'drizzle-orm';
import { cache } from 'react';
import type { Section } from '@/lib/sections';
import { db, schema } from '@/server/db';

const { games, pages, revisions, news, threads, channels } = schema;

export const getGames = cache(() => db.select().from(games).orderBy(asc(games.sortOrder)));

export const getGame = cache(async (slug: string) => (await db.select().from(games).where(eq(games.slug, slug)).limit(1))[0] ?? null);

export function getGamePages(gameId: number, section?: Section) {
  return db
    .select({ id: pages.id, section: pages.section, slug: pages.slug, title: pages.title, summary: pages.summary, image: pages.image })
    .from(pages)
    .where(section ? and(eq(pages.gameId, gameId), eq(pages.section, section)) : eq(pages.gameId, gameId))
    .orderBy(desc(pages.views), asc(pages.id));
}

export const getPage = cache(async (gameSlug: string, section: Section, slug: string) => {
  const [row] = await db
    .select({ page: pages, game: games, revision: revisions })
    .from(pages)
    .innerJoin(games, eq(pages.gameId, games.id))
    .leftJoin(revisions, eq(pages.currentRevisionId, revisions.id))
    .where(and(eq(games.slug, gameSlug), eq(pages.section, section), eq(pages.slug, slug)))
    .limit(1);
  return row ?? null;
});

export type FeedItem = Awaited<ReturnType<typeof getNews>>[number];

export function getNews(limit = 20) {
  return db
    .select({ id: news.id, slug: news.slug, title: news.title, excerpt: news.excerpt, status: news.status, source: news.source, image: news.image, sponsored: news.sponsored, publishedAt: news.publishedAt, game: games.shortName })
    .from(news)
    .leftJoin(games, eq(news.gameId, games.id))
    .orderBy(desc(news.publishedAt))
    .limit(limit);
}

export function getMostRead(limit = 5) {
  return db
    .select({ title: pages.title, slug: pages.slug, section: pages.section, game: games.shortName, gameSlug: games.slug })
    .from(pages)
    .innerJoin(games, eq(pages.gameId, games.id))
    .where(isNotNull(pages.currentRevisionId))
    .orderBy(desc(pages.views), asc(pages.id))
    .limit(limit);
}

export function getHotThreads(limit = 3) {
  return db
    .select({ title: threads.title, slug: threads.slug, score: threads.score, replyCount: threads.replyCount, channel: channels.name, channelSlug: channels.slug })
    .from(threads)
    .innerJoin(channels, eq(threads.channelId, channels.id))
    .where(eq(threads.pinned, false))
    .orderBy(desc(threads.score))
    .limit(limit);
}

export async function getOtherGames(exceptSlug: string, slugs: string[]) {
  const all = await getGames();
  return slugs.map(s => all.find(g => g.slug === s && g.slug !== exceptSlug)).filter(g => g !== undefined);
}

export function getRelatedPages(gameId: number, excludeId: number, limit = 4) {
  return db
    .select({ title: pages.title, slug: pages.slug, section: pages.section })
    .from(pages)
    .where(and(eq(pages.gameId, gameId), ne(pages.id, excludeId)))
    .orderBy(desc(pages.views))
    .limit(limit);
}
