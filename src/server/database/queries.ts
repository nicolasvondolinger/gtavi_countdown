import { asc, eq, inArray } from 'drizzle-orm';
import { vehicleKey } from '@/lib/compare';
import { db, schema } from '@/server/db';

const { vehicles, games, modCategories, modOptions, builds, profiles } = schema;

const columns = { id: vehicles.id, slug: vehicles.slug, name: vehicles.name, class: vehicles.class, image: vehicles.image, seats: vehicles.seats, topSpeedMph: vehicles.topSpeedMph, zeroToSixty: vehicles.zeroToSixty, brakingFt: vehicles.brakingFt, armorSlots: vehicles.armorSlots, price: vehicles.price, whereToGet: vehicles.whereToGet, specsSample: vehicles.specsSample, game: games.shortName, gameSlug: games.slug };

export async function getVehicles() {
  const rows = await db.select(columns).from(vehicles).innerJoin(games, eq(vehicles.gameId, games.id)).orderBy(asc(games.sortOrder), asc(vehicles.name));
  return rows.map(v => ({ ...v, key: vehicleKey(v.gameSlug, v.slug) }));
}
export type Vehicle = Awaited<ReturnType<typeof getVehicles>>[number];

export async function getModCatalog() {
  const [categories, options] = await Promise.all([db.select().from(modCategories).orderBy(asc(modCategories.sortOrder)), db.select().from(modOptions).orderBy(asc(modOptions.sortOrder))]);
  return categories.map(c => ({ ...c, options: options.filter(o => o.categoryId === c.id) })).filter(c => c.options.length > 0);
}
export type ModCategory = Awaited<ReturnType<typeof getModCatalog>>[number];

export async function validateChoices(choices: Record<string, number>) {
  const ids = Object.values(choices);
  const catalog = await getModCatalog();
  const chosen = ids.length ? await db.select().from(modOptions).where(inArray(modOptions.id, ids)) : [];
  for (const [category, optionId] of Object.entries(choices)) {
    const cat = catalog.find(c => c.slug === category);
    if (!cat?.options.some(o => o.id === optionId)) return null;
  }
  return chosen;
}

export async function getBuild(code: string) {
  const [row] = await db
    .select({ build: builds, vehicle: vehicles, game: games, author: profiles.username })
    .from(builds)
    .innerJoin(vehicles, eq(builds.vehicleId, vehicles.id))
    .innerJoin(games, eq(vehicles.gameId, games.id))
    .leftJoin(profiles, eq(builds.authorId, profiles.userId))
    .where(eq(builds.code, code))
    .limit(1);
  return row ?? null;
}
