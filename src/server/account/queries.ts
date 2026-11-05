import { desc, eq, sql } from 'drizzle-orm';
import { db, schema } from '@/server/db';

const { profiles, revisions, pages, games, theories, threads, channels, builds, vehicles } = schema;

export async function getProfile(username: string) {
  const [profile] = await db.select().from(profiles).where(sql`lower(${profiles.username}) = ${username.toLowerCase()}`).limit(1);
  return profile ?? null;
}

export function getUserEdits(userId: string, limit = 20) {
  return db
    .select({ id: revisions.id, summary: revisions.summary, sizeDelta: revisions.sizeDelta, state: revisions.state, createdAt: revisions.createdAt, title: pages.title, section: pages.section, slug: pages.slug, gameSlug: games.slug, game: games.shortName })
    .from(revisions)
    .innerJoin(pages, eq(revisions.pageId, pages.id))
    .innerJoin(games, eq(pages.gameId, games.id))
    .where(eq(revisions.authorId, userId))
    .orderBy(desc(revisions.createdAt))
    .limit(limit);
}

export async function getUserTotals(userId: string) {
  const [row] = await db
    .select({
      edits: sql<number>`(select count(*)::int from ${revisions} where ${revisions.authorId} = ${userId})`,
      kept: sql<number>`(select count(*)::int from ${revisions} where ${revisions.authorId} = ${userId} and ${revisions.state} = 'accepted')`,
      theories: sql<number>`(select count(*)::int from ${theories} where ${theories.authorId} = ${userId})`,
      threads: sql<number>`(select count(*)::int from ${threads} where ${threads.authorId} = ${userId})`,
      builds: sql<number>`(select count(*)::int from ${builds} where ${builds.authorId} = ${userId})`,
    })
    .from(sql`(select 1) as one`);
  return row!;
}

export function getUserThreads(userId: string, limit = 20) {
  return db
    .select({ id: threads.id, title: threads.title, slug: threads.slug, replies: threads.replyCount, createdAt: threads.createdAt, channelSlug: channels.slug, channel: channels.name })
    .from(threads)
    .innerJoin(channels, eq(threads.channelId, channels.id))
    .where(eq(threads.authorId, userId))
    .orderBy(desc(threads.createdAt))
    .limit(limit);
}

export function getUserTheories(userId: string, limit = 20) {
  return db
    .select({ id: theories.id, title: theories.title, score: theories.score, createdAt: theories.createdAt, page: pages.title, section: pages.section, slug: pages.slug, gameSlug: games.slug })
    .from(theories)
    .innerJoin(pages, eq(theories.pageId, pages.id))
    .innerJoin(games, eq(pages.gameId, games.id))
    .where(eq(theories.authorId, userId))
    .orderBy(desc(theories.createdAt))
    .limit(limit);
}

export function getUserBuilds(userId: string, limit = 20) {
  return db
    .select({ id: builds.id, code: builds.code, name: builds.name, vehicle: vehicles.name, createdAt: builds.createdAt })
    .from(builds)
    .innerJoin(vehicles, eq(builds.vehicleId, vehicles.id))
    .where(eq(builds.authorId, userId))
    .orderBy(desc(builds.createdAt))
    .limit(limit);
}
