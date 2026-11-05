import { and, desc, eq, sql, type SQL } from 'drizzle-orm';
import { localize } from '@/i18n/localize';
import { translate } from '@/i18n/translate';
import { SECTION_SINGULAR, type Section } from '@/lib/sections';
import { db, schema } from '@/server/db';

const { pages, games, news, threads, channels } = schema;

export type Suggestion = { title: string; category: string; game: string | null; href: string };
export type SearchType = 'all' | 'pages' | 'news' | 'threads';

const singular = (s: Section, locale: string) => translate(locale, SECTION_SINGULAR[s]);
const ptTitle = sql`coalesce(${pages.i18n}#>>'{pt,title}', '')`;
const titleMatch = (q: string) => sql`(${pages.title} ILIKE ${`%${q}%`} OR word_similarity(${q}, ${pages.title}) > 0.4 OR ${ptTitle} ILIKE ${`%${q}%`})`;

export async function suggest(raw: string, locale = 'en', limit = 6): Promise<Suggestion[]> {
  const q = raw.trim();
  if (q.length < 2) return [];
  const rows = await db
    .select({ title: pages.title, section: pages.section, slug: pages.slug, game: games.shortName, gameSlug: games.slug, i18n: pages.i18n })
    .from(pages)
    .innerJoin(games, eq(pages.gameId, games.id))
    .where(titleMatch(q))
    .orderBy(sql`(${pages.title} ILIKE ${`${q}%`}) DESC`, sql`word_similarity(${q}, ${pages.title}) DESC`, desc(pages.views))
    .limit(limit);
  return rows.map(r => ({ title: localize(r, locale).title, category: singular(r.section, locale), game: r.game, href: `/${r.gameSlug}/${r.section}/${r.slug}` }));
}

export type SearchFilters = { type?: SearchType; status?: 'official' | 'leak' | 'theory'; game?: string };

export async function search(raw: string, filters: SearchFilters = {}, locale = 'en') {
  const q = raw.trim();
  const empty = { results: [] as Result[], counts: { pages: 0, news: 0, threads: 0 } };
  if (q.length < 2) return empty;

  const pageConds: SQL[] = [sql`(${pages.search} @@ websearch_to_tsquery('english', ${q}) OR ${titleMatch(q)} OR ${pages.i18n}#>>'{pt,summary}' ILIKE ${`%${q}%`})`];
  if (filters.game) pageConds.push(eq(games.slug, filters.game));
  if (filters.status) pageConds.push(eq(pages.status, filters.status));
  const pageRows = await db
    .select({ id: pages.id, title: pages.title, summary: pages.summary, section: pages.section, slug: pages.slug, status: pages.status, source: pages.source, image: pages.image, game: games.shortName, gameSlug: games.slug, i18n: pages.i18n })
    .from(pages)
    .innerJoin(games, eq(pages.gameId, games.id))
    .where(and(...pageConds))
    .orderBy(sql`(ts_rank(${pages.search}, websearch_to_tsquery('english', ${q})) + word_similarity(${q}, ${pages.title})) DESC`)
    .limit(30);

  const newsConds: SQL[] = [eq(news.sponsored, false), sql`(${news.title} ILIKE ${`%${q}%`} OR ${news.excerpt} ILIKE ${`%${q}%`} OR ${news.i18n}::text ILIKE ${`%${q}%`})`];
  if (filters.game) newsConds.push(eq(games.slug, filters.game));
  if (filters.status) newsConds.push(eq(news.status, filters.status));
  const newsRows = await db
    .select({ id: news.id, title: news.title, excerpt: news.excerpt, slug: news.slug, status: news.status, source: news.source, image: news.image, publishedAt: news.publishedAt, game: games.shortName, i18n: news.i18n })
    .from(news)
    .leftJoin(games, eq(news.gameId, games.id))
    .where(and(...newsConds))
    .orderBy(desc(news.publishedAt))
    .limit(20);

  const threadRows = filters.status || filters.game
    ? []
    : await db
        .select({ id: threads.id, title: threads.title, slug: threads.slug, replies: threads.replyCount, name: channels.name, channelSlug: channels.slug, i18n: channels.i18n })
        .from(threads)
        .innerJoin(channels, eq(threads.channelId, channels.id))
        .where(sql`(${threads.search} @@ websearch_to_tsquery('english', ${q}) OR ${threads.title} ILIKE ${`%${q}%`})`)
        .orderBy(desc(threads.score))
        .limit(20);

  const pageResults: Result[] = pageRows.map(row => localize(row, locale)).map(p => ({ key: `p${p.id}`, kind: 'pages', label: `${p.game} · ${singular(p.section, locale)}`, title: p.title, text: p.summary, href: `/${p.gameSlug}/${p.section}/${p.slug}`, status: p.status, source: p.source, image: p.image }));
  const newsResults: Result[] = newsRows.map(row => localize(row, locale)).map(n => ({ key: `n${n.id}`, kind: 'news', label: `${n.game ? `${n.game} · ` : ''}${translate(locale, 'News')}`, title: n.title, text: n.excerpt, href: `/news/${n.slug}`, status: n.status, source: n.source, image: n.image }));
  const threadResults: Result[] = threadRows.map(t => ({ key: `t${t.id}`, kind: 'threads', label: `${translate(locale, 'Forum')} · ${localize(t, locale).name}`, title: t.title, text: translate(locale, '{n} replies', { n: t.replies }), href: `/forums/${t.channelSlug}/${t.slug}`, status: null, source: null, image: null }));
  const results = [...pageResults, ...newsResults, ...threadResults].filter(r => !filters.type || filters.type === 'all' || r.kind === filters.type);
  return { results, counts: { pages: pageResults.length, news: newsResults.length, threads: threadResults.length } };
}

export type Result = { key: string; kind: 'pages' | 'news' | 'threads'; label: string; title: string; text: string; href: string; status: 'official' | 'leak' | 'theory' | null; source: string | null; image: string | null };
