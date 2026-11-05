import { and, eq, isNull, lte, or } from 'drizzle-orm';
import { db, schema } from '@/server/db';

const { mapMarkers, pages, games } = schema;

// Markers with a future visible_from stay hidden, on the server, so they never reach the browser.
export async function getMarkers(gameId: number, now = new Date()) {
  const rows = await db
    .select({ id: mapMarkers.id, layer: mapMarkers.layer, title: mapMarkers.title, description: mapMarkers.description, x: mapMarkers.x, y: mapMarkers.y, status: mapMarkers.status, source: mapMarkers.source, image: mapMarkers.image, section: pages.section, slug: pages.slug, gameSlug: games.slug })
    .from(mapMarkers)
    .leftJoin(pages, eq(mapMarkers.pageId, pages.id))
    .leftJoin(games, eq(pages.gameId, games.id))
    .where(and(eq(mapMarkers.gameId, gameId), or(isNull(mapMarkers.visibleFrom), lte(mapMarkers.visibleFrom, now))));
  return rows.map(({ section, slug, gameSlug, ...m }) => ({ ...m, href: slug ? `/${gameSlug}/${section}/${slug}` : null }));
}
export type Marker = Awaited<ReturnType<typeof getMarkers>>[number];
