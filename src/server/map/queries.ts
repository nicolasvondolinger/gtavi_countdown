import { and, eq, isNull, lte, or } from 'drizzle-orm';
import { localize } from '@/i18n/localize';
import { db, schema } from '@/server/db';

const { mapMarkers, pages, games } = schema;

// Markers with a future visible_from stay hidden, on the server, so they never reach the browser.
export async function getMarkers(gameId: number, locale = 'en', now = new Date()) {
  const rows = await db
    .select({ id: mapMarkers.id, layer: mapMarkers.layer, title: mapMarkers.title, description: mapMarkers.description, x: mapMarkers.x, y: mapMarkers.y, status: mapMarkers.status, source: mapMarkers.source, image: mapMarkers.image, section: pages.section, slug: pages.slug, gameSlug: games.slug, summary: pages.summary, i18n: pages.i18n })
    .from(mapMarkers)
    .leftJoin(pages, eq(mapMarkers.pageId, pages.id))
    .leftJoin(games, eq(pages.gameId, games.id))
    .where(and(eq(mapMarkers.gameId, gameId), or(isNull(mapMarkers.visibleFrom), lte(mapMarkers.visibleFrom, now))));
  return rows.map(({ section, slug, gameSlug, summary, i18n, ...m }) => ({ ...m, description: i18n ? localize({ summary, i18n }, locale).summary : m.description, source: i18n ? localize({ source: m.source, i18n }, locale).source : m.source, href: slug ? `/${gameSlug}/${section}/${slug}` : null }));
}
export type Marker = Awaited<ReturnType<typeof getMarkers>>[number];
