// Sample community data for development and demos. Never run this in production.
import 'dotenv/config';
import { and, eq } from 'drizzle-orm';
import { db, schema, sql } from './index';
import { seedFacts } from './seed';

const s = schema;
const USERS: [id: string, name: string, avatar: string, rep: number, role: 'member' | 'reviewer' | 'moderator'][] = [
  ['sample-vicevoyager', 'ViceVoyager', 'jason', 4820, 'reviewer'],
  ['sample-keys', 'KeysCartographer', 'cal', 6120, 'moderator'],
  ['sample-jasonmains', 'JasonMains', 'raul', 2100, 'reviewer'],
  ['sample-miami', 'MiamiNights', 'boobie', 40, 'member'],
  ['sample-booker', 'Booker305', 'drequan', 1500, 'reviewer'],
  ['sample-onlyraw', 'OnlyRawFan', 'real_dimez', 900, 'reviewer'],
];
const MODS: Record<string, [string, number, Record<string, number>][]> = {
  engine: [['Stock', 0, {}], ['EMS upgrade, level 1', 9000, { acceleration: 4 }], ['EMS upgrade, level 2', 12500, { acceleration: 8 }], ['EMS upgrade, level 3', 18000, { acceleration: 12 }], ['EMS upgrade, level 4', 33500, { acceleration: 16 }]],
  brakes: [['Stock', 0, {}], ['Street brakes', 20000, { braking: 8 }], ['Sport brakes', 27000, { braking: 13 }], ['Race brakes', 35000, { braking: 18 }]],
  transmission: [['Stock', 0, {}], ['Street', 15000, { topSpeed: 3 }], ['Sport', 29500, { topSpeed: 6 }], ['Race', 40000, { topSpeed: 9 }]],
  suspension: [['Stock', 0, {}], ['Street', 10000, { handling: 4 }], ['Sport', 15000, { handling: 7 }], ['Competition', 20000, { handling: 10 }]],
  armor: [['None', 0, {}], ['20%', 5000, { armor: 10 }], ['40%', 12000, { armor: 20 }], ['60%', 20000, { armor: 30 }], ['80%', 40000, { armor: 40 }], ['100%', 50000, { armor: 50 }]],
  turbo: [['None', 0, {}], ['Turbo tuning', 50000, { acceleration: 6 }]],
  livery: [['Stock paint', 0, {}], ['Race stripe', 6000, {}]],
  wheels: [['Stock', 0, {}], ['High end, 18 in', 8750, {}]],
};
const SPECS: [slug: string, speed: number, sixty: number, braking: number, armor: number, price: number | null, where: string][] = [
  ['cheetah-classic', 121, 3.9, 118, 5, 695000, 'Legendary Motorsport'], ['infernus', 124, 3.8, 121, 5, 440000, 'Legendary Motorsport'], ['zentorno', 131, 3.3, 112, 5, 725000, 'Legendary Motorsport'],
  ['adder', 126, 3.5, 124, 5, 1000000, 'Legendary Motorsport'], ['grotti-cheetah', 108, 5.2, 131, 3, null, 'Unknown'],
];
const hoursAgo = (h: number) => new Date(Date.now() - h * 36e5);

async function main() {
  const gameId = await seedFacts();
  for (const [id, name, avatar, rep, role] of USERS) {
    await db.insert(s.user).values({ id, name, email: `${id}@example.invalid`, emailVerified: true }).onConflictDoNothing();
    await db.insert(s.profiles).values({ userId: id, username: name, avatar, rep, role, onboardedAt: new Date(), favoriteGameId: gameId['gta-6'] }).onConflictDoNothing();
  }
  const cats = await db.select().from(s.modCategories);
  if (!(await db.$count(s.modOptions))) {
    for (const c of cats) await db.insert(s.modOptions).values((MODS[c.slug] ?? []).map(([name, price, deltas], sortOrder) => ({ categoryId: c.id, name, price, deltas, sortOrder })));
  }
  for (const [slug, topSpeedMph, zeroToSixty, brakingFt, armorSlots, price, whereToGet] of SPECS) {
    await db.update(s.vehicles).set({ topSpeedMph, zeroToSixty, brakingFt, armorSlots, price, whereToGet, specsSample: true }).where(eq(s.vehicles.slug, slug));
  }
  const lucia = await db.query.pages.findFirst({ where: and(eq(s.pages.gameId, gameId['gta-6']!), eq(s.pages.slug, 'lucia')) });
  if (!lucia) throw new Error('facts seed missing');

  if (!(await db.$count(s.theories))) {
    await db.insert(s.theories).values([
      { pageId: lucia.id, authorId: 'sample-vicevoyager', title: 'Lucia took a plea deal that ties her to Jason’s first job', body: 'The probation scene in Trailer 1 and release paperwork in Trailer 2 point to an early release with conditions. Frame analysis suggests those conditions push her toward the first heist.', score: 1600, plausibleVotes: 1669, totalVotes: 2318 },
      { pageId: lucia.id, authorId: 'sample-jasonmains', title: 'Lucia is related to a returning Vice City character', body: 'Background posters may hint at family ties.', score: 942, plausibleVotes: 459, totalVotes: 1120 },
      { pageId: lucia.id, authorId: 'sample-miami', title: 'Lucia and Jason meet during a heist, not after prison', body: 'Timeline of the two trailers suggests an earlier meeting.', score: 611, plausibleVotes: 467, totalVotes: 806 },
    ]);
  }
  if (!(await db.$count(s.comments))) {
    const [top] = await db.insert(s.comments).values({ pageId: lucia.id, authorId: 'sample-keys', body: 'The penitentiary in Trailer 1 lines up with the Grassrivers coordinates in the map thread. I added a marker.', score: 412, createdAt: hoursAgo(2) }).returning();
    await db.insert(s.comments).values([
      { pageId: lucia.id, parentId: top!.id, authorId: 'sample-vicevoyager', body: 'Checked it against the Trailer 2 aerial shot. Updating Biography with a citation.', score: 188, createdAt: hoursAgo(1) },
      { pageId: lucia.id, parentId: top!.id, authorId: 'sample-miami', body: 'Please spoiler-tag anything from the leak.', score: 23, createdAt: hoursAgo(0.6) },
    ]);
  }
  if (!(await db.$count(s.revisions, eq(s.revisions.state, 'pending')))) {
    const current = await db.query.revisions.findFirst({ where: eq(s.revisions.id, lucia.currentRevisionId!) });
    const body = `${current!.body}\n\nThe penitentiary in Trailer 1 matches a walled compound in Grassrivers seen in the Trailer 2 aerial shot. [3]`;
    const [rev] = await db.insert(s.revisions).values({ pageId: lucia.id, authorId: 'sample-vicevoyager', parentId: current!.id, body, summary: 'Biography: add Trailer 2 aerial match for the penitentiary', sourceKind: 'community', source: 'Map leak megathread', state: 'pending', sizeDelta: body.length - current!.body.length, createdAt: hoursAgo(3) }).returning();
    await db.insert(s.revisionVotes).values([{ revisionId: rev!.id, userId: 'sample-booker', vote: 'keep' }, { revisionId: rev!.id, userId: 'sample-jasonmains', vote: 'keep' }, { revisionId: rev!.id, userId: 'sample-onlyraw', vote: 'revert' }]);
  }
  const channels = Object.fromEntries((await db.select().from(s.channels)).map(c => [c.slug, c.id]));
  const tagIds = Object.fromEntries((await db.select().from(s.tags)).map(t => [t.slug, t.id]));
  if (!(await db.$count(s.threads))) {
    const THREADS: [slug: string, title: string, author: string, score: number, replies: number, h: number, tagList: string[], extra?: Partial<typeof s.threads.$inferInsert>, channel?: string][] = [
      ['launch-week-rules', 'Launch week rules: spoiler tags are required from the 12 November preload', 'sample-keys', 0, 41, 60, [], { pinned: true }],
      ['trailer-2-frame-by-frame', 'Trailer 2 frame by frame: every storefront in Vice City', 'sample-vicevoyager', 4200, 612, 3, ['trailer-2', 'vice-city'], { image: 'places/vice-city/01.webp' }],
      ['map-leak-megathread', 'Map leak megathread: grid overlays and scale comparisons', 'sample-keys', 3100, 1402, 5, ['map-leak'], { spoiler: true, image: 'places/grassrivers/01.webp' }],
      ['lucia-father-evidence', 'Is Lucia’s father a returning character? Evidence thread', 'sample-jasonmains', 1800, 488, 9, ['theory', 'lucia']],
      ['which-edition', 'Which edition are you getting, and why?', 'sample-miami', 402, 231, 11, ['editions'], { image: 'editions/ultimate/01.webp' }],
      ['best-map', 'Is San Andreas still the best map in the series?', 'sample-booker', 418, 96, 20, [], {}, 'general'],
    ];
    for (const [slug, title, authorId, score, replyCount, h, tagList, extra, channel] of THREADS) {
      const [t] = await db.insert(s.threads).values({ channelId: channels[channel ?? 'gta-vi-speculation']!, slug, title, authorId, score, replyCount, body: 'All material goes here so the rest of the forum stays readable. Sources in the first reply.', createdAt: hoursAgo(h), lastActivityAt: hoursAgo(h / 2), ...extra }).returning();
      if (tagList.length) await db.insert(s.threadTags).values(tagList.map(tag => ({ threadId: t!.id, tagId: tagIds[tag]! })));
      if (slug === 'map-leak-megathread') {
        const [p] = await db.insert(s.posts).values({ threadId: t!.id, authorId: 'sample-vicevoyager', body: 'Laying the overlay on the Trailer 2 aerial shot gives roughly 1.6 times the scale of Los Santos.', score: 892, createdAt: hoursAgo(4) }).returning();
        await db.insert(s.posts).values([{ threadId: t!.id, parentId: p!.id, authorId: 'sample-keys', body: 'Matches my grid. Adding it to the comparison table in the first post.', score: 310, createdAt: hoursAgo(4) }, { threadId: t!.id, authorId: 'sample-jasonmains', body: 'Reminder that Rockstar has confirmed none of this.', score: 276, createdAt: hoursAgo(2) }]);
        const grass = await db.query.pages.findFirst({ where: eq(s.pages.slug, 'grassrivers') });
        if (grass) await db.insert(s.threadPages).values({ threadId: t!.id, pageId: grass.id });
      }
    }
  }
  await db.insert(s.news).values([
    { slug: 'sample-grassrivers-grid', gameId: gameId['gta-6'], title: 'Datamined grid puts Grassrivers at roughly twice the size of Blaine County', excerpt: 'Unverified coordinates are circulating on the forums.', body: 'Unverified coordinates are circulating on the forums.', status: 'leak', source: 'Forum thread', image: 'places/grassrivers/01.webp', publishedAt: hoursAgo(5) },
    { slug: 'sample-motel-safehouse', gameId: gameId['gta-6'], title: 'The Leonida Keys motel could be the first safehouse', excerpt: 'Top community theories, ranked by votes.', body: 'Top community theories, ranked by votes.', status: 'theory', source: 'Lore desk', image: 'art/key-motel.webp', publishedAt: hoursAgo(9) },
    { slug: 'sample-spaceship-parts', gameId: gameId['gta-5'], title: 'All 50 spaceship parts in GTA V, with a map', excerpt: 'A refreshed guide with every location.', body: 'A refreshed guide with every location.', source: 'Guide', publishedAt: hoursAgo(26) },
    { slug: 'sample-native-ad', title: 'Native ad slot: headline set like a story', excerpt: 'Sponsored placement.', body: 'Sponsored placement.', source: 'Advertiser name', sponsored: true, publishedAt: hoursAgo(6) },
  ]).onConflictDoNothing();
  const gta6 = gameId['gta-6']!;
  if (!(await db.$count(s.mapMarkers, eq(s.mapMarkers.status, 'leak')))) {
    await db.insert(s.mapMarkers).values([
      { gameId: gta6, layer: 'leak', title: 'Walled compound', description: 'Possible location of the penitentiary.', x: 0.6, y: 0.6, status: 'leak', source: 'Map leak megathread' },
      { gameId: gta6, layer: 'theory', title: 'Possible safehouse', description: 'Community guess from Trailer 2.', x: 0.7, y: 0.78, status: 'theory', source: 'Lore desk' },
      { gameId: gta6, layer: 'mission', title: 'First mission start', description: 'Hidden until launch.', x: 0.8, y: 0.7, visibleFrom: new Date('2026-11-19T00:00:00Z') },
    ]);
  }
  const VIEWS: [string, number][] = [['lucia', 1200], ['cheat-codes', 980], ['release-date-and-editions', 742], ['carl-johnson', 511], ['los-santos', 305]];
  for (const [slug, views] of VIEWS) await db.update(s.pages).set({ views }).where(eq(s.pages.slug, slug));
  console.log('seeded sample data');
  await sql.end();
}

await main();
