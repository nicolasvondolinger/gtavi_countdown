import { eq } from 'drizzle-orm';
import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';
import { db, schema } from '@/server/db';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { games, pages, news, channels, threads } = schema;
  const [gameRows, pageRows, newsRows, threadRows] = await Promise.all([
    db.select({ slug: games.slug }).from(games),
    db.select({ section: pages.section, slug: pages.slug, game: games.slug, updatedAt: pages.updatedAt }).from(pages).innerJoin(games, eq(pages.gameId, games.id)),
    db.select({ slug: news.slug, publishedAt: news.publishedAt }).from(news).where(eq(news.sponsored, false)),
    db.select({ slug: threads.slug, channel: channels.slug, at: threads.lastActivityAt }).from(threads).innerJoin(channels, eq(threads.channelId, channels.id)),
  ]);
  const url = (path: string) => `${SITE_URL}${path}`;
  return [
    { url: url('/'), changeFrequency: 'daily', priority: 1 },
    { url: url('/games'), priority: 0.8 },
    { url: url('/news'), changeFrequency: 'hourly', priority: 0.8 },
    { url: url('/forums'), changeFrequency: 'hourly', priority: 0.7 },
    { url: url('/database/vehicles/compare'), priority: 0.6 },
    ...gameRows.flatMap(g => [{ url: url(`/${g.slug}`), priority: 0.8 }, { url: url(`/${g.slug}/map`), priority: 0.6 }]),
    ...pageRows.map(p => ({ url: url(`/${p.game}/${p.section}/${p.slug}`), lastModified: p.updatedAt, priority: 0.7 })),
    ...newsRows.map(n => ({ url: url(`/news/${n.slug}`), lastModified: n.publishedAt, priority: 0.6 })),
    ...threadRows.map(t => ({ url: url(`/forums/${t.channel}/${t.slug}`), lastModified: t.at, priority: 0.4 })),
  ];
}
