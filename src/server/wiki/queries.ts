import { and, asc, desc, eq, isNotNull, ne, sql } from 'drizzle-orm';
import { cache } from 'react';
import { localize } from '@/i18n/localize';
import type { Section } from '@/lib/sections';
import { db, schema } from '@/server/db';

const { games, pages, revisions, news, threads, channels, videos } = schema;

const allGames = cache(() => db.select().from(games).orderBy(asc(games.sortOrder)));

export const getGames = async (locale: string) => (await allGames()).map(g => localize(g, locale));

export const getGame = async (slug: string, locale: string) => {
  const game = (await allGames()).find(g => g.slug === slug);
  return game ? localize(game, locale) : null;
};

export async function getGamePages(gameId: number, locale: string, section?: Section) {
  const rows = await db
    .select({ id: pages.id, section: pages.section, slug: pages.slug, title: pages.title, summary: pages.summary, image: pages.image, i18n: pages.i18n })
    .from(pages)
    .where(section ? and(eq(pages.gameId, gameId), eq(pages.section, section)) : eq(pages.gameId, gameId))
    .orderBy(desc(pages.views), asc(pages.id));
  return rows.map(p => localize(p, locale));
}

export const getPage = cache(async (gameSlug: string, section: Section, slug: string, locale: string) => {
  const [row] = await db
    .select({ page: pages, game: games })
    .from(pages)
    .innerJoin(games, eq(pages.gameId, games.id))
    .where(and(eq(games.slug, gameSlug), eq(pages.section, section), eq(pages.slug, slug)))
    .limit(1);
  if (!row) return null;
  // Portuguese falls back to the English text until someone translates the page.
  const translated = locale !== 'pt' || !!row.page.currentRevisionPt;
  const revisionId = locale === 'pt' ? (row.page.currentRevisionPt ?? row.page.currentRevisionId) : row.page.currentRevisionId;
  const [revision] = revisionId ? await db.select().from(revisions).where(eq(revisions.id, revisionId)).limit(1) : [];
  return { page: localize(row.page, locale), game: localize(row.game, locale), revision: revision ?? null, translated };
});

export type FeedItem = Awaited<ReturnType<typeof getNews>>[number];

export async function getNews(locale: string, limit = 20) {
  const rows = await db
    .select({ id: news.id, slug: news.slug, title: news.title, excerpt: news.excerpt, status: news.status, source: news.source, image: news.image, sponsored: news.sponsored, publishedAt: news.publishedAt, game: games.shortName, i18n: news.i18n })
    .from(news)
    .leftJoin(games, eq(news.gameId, games.id))
    .orderBy(desc(news.publishedAt))
    .limit(limit);
  return rows.map(n => localize(n, locale));
}

export async function getStory(slug: string, locale: string) {
  const [row] = await db.select({ story: news, game: games.shortName }).from(news).leftJoin(games, eq(news.gameId, games.id)).where(eq(news.slug, slug)).limit(1);
  return row ? { story: localize(row.story, locale), game: row.game } : null;
}

export async function getMostRead(locale: string, limit = 5) {
  const rows = await db
    .select({ title: pages.title, slug: pages.slug, section: pages.section, game: games.shortName, gameSlug: games.slug, i18n: pages.i18n })
    .from(pages)
    .innerJoin(games, eq(pages.gameId, games.id))
    .where(isNotNull(pages.currentRevisionId))
    .orderBy(desc(pages.views), asc(pages.id))
    .limit(limit);
  return rows.map(p => localize(p, locale));
}

export async function getHotThreads(locale: string, limit = 3) {
  const rows = await db
    .select({ title: threads.title, slug: threads.slug, score: threads.score, replyCount: threads.replyCount, name: channels.name, channelSlug: channels.slug, i18n: channels.i18n })
    .from(threads)
    .innerJoin(channels, eq(threads.channelId, channels.id))
    .where(eq(threads.pinned, false))
    .orderBy(desc(threads.score))
    .limit(limit);
  return rows.map(t => ({ ...localize(t, locale), channel: localize(t, locale).name }));
}

export async function getOtherGames(exceptSlug: string, slugs: string[], locale: string) {
  const all = await getGames(locale);
  return slugs.map(s => all.find(g => g.slug === s && g.slug !== exceptSlug)).filter(g => g !== undefined);
}

export type Video = { youtubeId: string; title: string; kind: string; game: string | null; gameSlug: string | null };

export function getVideos({ gameSlug, kind, limit = 500 }: { gameSlug?: string; kind?: string; limit?: number } = {}): Promise<Video[]> {
  const conds = [gameSlug ? eq(games.slug, gameSlug) : undefined, kind ? eq(videos.kind, kind) : undefined].filter(c => c !== undefined);
  return db
    .select({ youtubeId: videos.youtubeId, title: videos.title, kind: videos.kind, game: games.shortName, gameSlug: games.slug })
    .from(videos)
    .leftJoin(games, eq(videos.gameId, games.id))
    .where(conds.length ? and(...conds) : undefined)
    .orderBy(asc(videos.position))
    .limit(limit);
}

export const getVideoCounts = () =>
  db
    .select({ slug: games.slug, name: games.shortName, order: games.sortOrder, count: sql<number>`count(*)::int` })
    .from(videos)
    .innerJoin(games, eq(videos.gameId, games.id))
    .groupBy(games.slug, games.shortName, games.sortOrder)
    .orderBy(asc(games.sortOrder));

export function getRelatedPages(gameId: number, excludeId: number, limit = 4) {
  return db
    .select({ title: pages.title, slug: pages.slug, section: pages.section })
    .from(pages)
    .where(and(eq(pages.gameId, gameId), ne(pages.id, excludeId)))
    .orderBy(desc(pages.views))
    .limit(limit);
}
