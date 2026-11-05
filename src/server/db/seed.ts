// Facts only: safe to run in production. Sample users, votes and specs live in seed-sample.ts.
import 'dotenv/config';
import { and, eq, sql as dsql } from 'drizzle-orm';
import { db, schema, sql } from './index';

const { games, pages, revisions, channels, tags, news, mapMarkers, modCategories, vehicles } = schema;

type Universe = 'hd' | '3d' | '2d';
type Fact = { label: string; value: string };
const GAMES: [slug: string, name: string, short: string, year: number, universe: Universe, setting: string, leads: string, facts: Fact[], summary?: string, image?: string, releaseAt?: Date][] = [
  ['gta-6', 'Grand Theft Auto VI', 'GTA VI', 2026, 'hd', 'Leonida', 'Lucia Caminos, Jason Duval', [{ label: 'Release', value: '19 November 2026' }, { label: 'Developer', value: 'Rockstar Games' }, { label: 'Platforms', value: 'PS5, Xbox Series X|S' }, { label: 'Setting', value: 'State of Leonida, including Vice City' }, { label: 'Universe', value: 'HD universe' }], 'Lucia and Jason, a criminal duo, are pulled into a conspiracy across the state of Leonida.', 'bg/hero.webp', new Date('2026-11-19T00:00:00Z')],
  ['gta-online', 'GTA Online', 'GTA Online', 2013, 'hd', 'Los Santos, Blaine County', 'Your own character', [{ label: 'Released', value: '1 October 2013' }, { label: 'Developer', value: 'Rockstar North' }, { label: 'Setting', value: 'Los Santos and Blaine County' }, { label: 'Universe', value: 'HD universe' }], 'The online world of Grand Theft Auto V, updated for over a decade.'],
  ['gta-5', 'Grand Theft Auto V', 'GTA V', 2013, 'hd', 'Los Santos, Blaine County', 'Michael, Franklin, Trevor', [{ label: 'Released', value: '17 September 2013' }, { label: 'Developer', value: 'Rockstar North' }, { label: 'Platforms', value: 'PS3, Xbox 360, PS4, Xbox One, PC, PS5, Xbox Series X|S' }, { label: 'Setting', value: 'Los Santos and Blaine County, San Andreas' }, { label: 'Universe', value: 'HD universe' }], 'Michael, Franklin and Trevor run heists across Los Santos and Blaine County.'],
  ['gta-chinatown-wars', 'Chinatown Wars', 'Chinatown Wars', 2009, 'hd', 'Liberty City', 'Huang Lee', []],
  ['gta-4', 'Grand Theft Auto IV', 'GTA IV', 2008, 'hd', 'Liberty City', 'Niko Bellic', [{ label: 'Released', value: '29 April 2008' }, { label: 'Developer', value: 'Rockstar North' }, { label: 'Setting', value: 'Liberty City' }, { label: 'Universe', value: 'HD universe' }], 'Niko Bellic arrives in Liberty City looking for a new life and the man who betrayed him.'],
  ['gta-vice-city-stories', 'Vice City Stories', 'Vice City Stories', 2006, '3d', 'Vice City', 'Victor Vance', []],
  ['gta-liberty-city-stories', 'Liberty City Stories', 'Liberty City Stories', 2005, '3d', 'Liberty City', 'Toni Cipriani', []],
  ['gta-san-andreas', 'San Andreas', 'GTA San Andreas', 2004, '3d', 'Los Santos, San Fierro, Las Venturas', 'Carl Johnson', [{ label: 'Released', value: '26 October 2004' }, { label: 'Developer', value: 'Rockstar North' }, { label: 'Setting', value: 'State of San Andreas' }, { label: 'Universe', value: '3D universe' }], 'Carl Johnson returns to Los Santos after his mother is killed.'],
  ['gta-advance', 'Advance', 'GTA Advance', 2004, '3d', 'Liberty City', 'Mike', []],
  ['gta-vice-city', 'Vice City', 'GTA Vice City', 2002, '3d', 'Vice City', 'Tommy Vercetti', [{ label: 'Released', value: '29 October 2002' }, { label: 'Developer', value: 'Rockstar North' }, { label: 'Setting', value: 'Vice City, 1986' }, { label: 'Universe', value: '3D universe' }], 'Tommy Vercetti builds a criminal empire in 1980s Vice City.'],
  ['gta-3', 'Grand Theft Auto III', 'GTA III', 2001, '3d', 'Liberty City', 'Claude', [{ label: 'Released', value: '22 October 2001' }, { label: 'Developer', value: 'DMA Design' }, { label: 'Setting', value: 'Liberty City' }, { label: 'Universe', value: '3D universe' }], 'The first 3D game in the series.'],
  ['gta-2', 'Grand Theft Auto 2', 'GTA 2', 1999, '2d', 'Anywhere City', 'Claude Speed', []],
  ['gta-london-1969', 'London 1969', 'London 1969', 1999, '2d', 'London', 'Unnamed criminal', []],
  ['gta-1', 'Grand Theft Auto', 'GTA', 1997, '2d', 'Liberty City, San Andreas, Vice City', 'Eight selectable characters', []],
];

type Sec = 'characters' | 'vehicles' | 'locations' | 'guides' | 'lore';
type PageSeed = { game: string; section: Sec; slug: string; title: string; summary: string; body: string; status?: 'official'; source?: string; image?: string; gallery?: string[]; infobox?: { label: string; value: string }[] };
const SRC6 = 'Rockstar Games character profiles';
const char6 = (slug: string, title: string, role: string, img: string, summary: string, body: string): PageSeed => ({
  game: 'gta-6', section: 'characters', slug, title, summary, status: 'official', source: SRC6, image: `characters/${img}.webp`,
  body: `${summary}\n\n## Biography\n\n${body}\n\n## References\n\n1. Grand Theft Auto VI character profiles, Rockstar Games website.`,
  infobox: [{ label: 'Role', value: role }, { label: 'Home', value: 'Leonida' }, { label: 'Game', value: 'Grand Theft Auto VI' }],
});
const region = (slug: string, title: string, summary: string, img: string): PageSeed => ({
  game: 'gta-6', section: 'locations', slug, title, summary, status: 'official', source: 'Rockstar Games website', image: `world/${img}.webp`,
  body: `${summary}\n\n## References\n\n1. Grand Theft Auto VI locations, Rockstar Games website.`, infobox: [{ label: 'State', value: 'Leonida' }, { label: 'Game', value: 'Grand Theft Auto VI' }],
});
const plain = (game: string, section: Sec, slug: string, title: string, summary: string): PageSeed => ({ game, section, slug, title, summary, body: summary });

const PAGES: PageSeed[] = [
  { ...char6('lucia', 'Lucia Caminos', 'Protagonist', 'lucia', 'Lucia Caminos is one of the two protagonists of Grand Theft Auto VI, alongside Jason Duval. She first appears in Trailer 1, in the Leonida Penitentiary.', 'Rockstar describes Lucia as someone whose father taught her to fight as soon as she could walk. Fighting for her family landed her in the Leonida Penitentiary, and sheer luck got her out.\n\nAfter her release she teams up with Jason, and the pair are pulled into a criminal conspiracy that stretches across the state.\n\n## Appearances\n\n| Where | When |\n| --- | --- |\n| Trailer 1 | 5 December 2023 |\n| Trailer 2 | 6 May 2025 |'), infobox: [{ label: 'Status', value: 'Playable' }, { label: 'Home', value: 'Leonida' }, { label: 'First seen', value: 'Trailer 1, 5 Dec 2023' }, { label: 'Associates', value: 'Jason Duval' }, { label: 'Voice actor', value: 'Not announced' }], gallery: ['characters/feature.webp', 'bg/duo3.webp', 'bg/motel.webp'] },
  char6('jason', 'Jason Duval', 'Protagonist', 'jason', 'Jason Duval is one of the two protagonists of Grand Theft Auto VI, alongside Lucia Caminos.', 'Rockstar describes Jason as someone who wants an easy life while things keep getting harder. He grew up around grifters and crooks, and after a stint in the Army he ended up in the Leonida Keys working for local drug runners.'),
  char6('cal-hampton', 'Cal Hampton', 'Jason’s friend', 'cal', 'Cal Hampton is Jason’s friend and a fellow associate of Brian Heder.', 'Cal is happiest at home, deep in conspiracy theories, and he works alongside Jason for Brian Heder.'),
  char6('boobie-ike', 'Boobie Ike', 'Only Raw Records', 'boobie', 'Boobie Ike is a Vice City local legend with interests in property, a strip club and Only Raw Records.', 'Boobie runs his businesses out of Vice City and co-owns the label Only Raw Records with Dre’Quan Priest.'),
  char6('drequan-priest', 'Dre’Quan Priest', 'Only Raw Records', 'drequan', 'Dre’Quan Priest is a partner in Only Raw Records.', 'Dre’Quan moved from street hustling into music, and he signed the duo Real Dimez to Only Raw Records.'),
  char6('real-dimez', 'Real Dimez', 'Rap duo', 'real_dimez', 'Real Dimez is the rap duo of Bae-Luxe and Roxy, signed to Only Raw Records.', 'Bae-Luxe and Roxy have been friends since high school and work together as Real Dimez.'),
  char6('raul-bautista', 'Raul Bautista', 'Bank robber', 'raul', 'Raul Bautista is a seasoned bank robber who looks for talent willing to take big risks.', 'Rockstar presents Raul as confident and cunning, always hunting for people ready to take the risks that bring the biggest rewards.'),
  char6('brian-heder', 'Brian Heder', 'Drug runner', 'brian', 'Brian Heder is a veteran drug runner in the Leonida Keys.', 'Brian has been smuggling since the golden age of the trade in the Keys, and he has Jason doing his dirty work.'),
  region('vice-city', 'Vice City', 'Vice City is the largest city in Leonida, known for its beaches, nightlife and sun.', 'vice_city'),
  region('leonida-keys', 'Leonida Keys', 'The Leonida Keys are an island chain off the southern tip of the state.', 'leonida_keys'),
  region('grassrivers', 'Grassrivers', 'Grassrivers is the wetland region in the south of Leonida.', 'grassrivers'),
  region('port-gellhorn', 'Port Gellhorn', 'Port Gellhorn is a faded resort town on the Leonida coast.', 'port_gellhorn'),
  region('ambrosia', 'Ambrosia', 'Ambrosia is an inland area of Leonida built around sugar production.', 'ambrosia'),
  region('mount-kalaga', 'Mount Kalaga', 'Mount Kalaga is the mountainous national park in the north of Leonida.', 'mount_kalaga'),
  { game: 'gta-6', section: 'guides', slug: 'release-date-and-editions', title: 'Release date and editions', summary: 'Grand Theft Auto VI launches worldwide on 19 November 2026 on PS5 and Xbox Series X|S. Digital preload opens on 12 November.', body: 'Grand Theft Auto VI launches worldwide on 19 November 2026 on PS5 and Xbox Series X|S. Digital preload opens on 12 November.\n\nNo PC version has been announced.', status: 'official', source: 'Rockstar Games', image: 'editions/standard.webp' },
  plain('gta-5', 'characters', 'michael-de-santa', 'Michael De Santa', 'Michael De Santa is a retired bank robber living in Rockwood under witness protection, and one of the three protagonists of Grand Theft Auto V.'),
  plain('gta-5', 'characters', 'franklin-clinton', 'Franklin Clinton', 'Franklin Clinton is a repo man from Strawberry and one of the three protagonists of Grand Theft Auto V.'),
  plain('gta-5', 'characters', 'trevor-philips', 'Trevor Philips', 'Trevor Philips is Michael’s former partner, living in Blaine County, and one of the three protagonists of Grand Theft Auto V.'),
  plain('gta-5', 'characters', 'lamar-davis', 'Lamar Davis', 'Lamar Davis is Franklin’s best friend from Chamberlain Hills.'),
  plain('gta-5', 'vehicles', 'infernus', 'Pegassi Infernus', 'The Pegassi Infernus is a two-door super car.'),
  plain('gta-5', 'vehicles', 'zentorno', 'Pegassi Zentorno', 'The Pegassi Zentorno is a two-door super car.'),
  plain('gta-5', 'vehicles', 'adder', 'Truffade Adder', 'The Truffade Adder is a two-door super car.'),
  plain('gta-5', 'locations', 'los-santos', 'Los Santos', 'Los Santos is the city at the centre of Grand Theft Auto V.'),
  plain('gta-5', 'locations', 'blaine-county', 'Blaine County', 'Blaine County is the rural region north of Los Santos.'),
  plain('gta-5', 'locations', 'mount-chiliad', 'Mount Chiliad', 'Mount Chiliad is the tallest mountain in Blaine County.'),
  plain('gta-5', 'guides', 'cheat-codes', 'Cheat codes', 'Cheat codes for Grand Theft Auto V by platform.'),
  plain('gta-5', 'guides', 'spaceship-parts', 'Spaceship parts', 'All 50 spaceship parts collected for Omega in Grand Theft Auto V.'),
  plain('gta-5', 'lore', 'epsilon-program', 'Epsilon Program', 'The Epsilon Program is a religious movement parodied in the series.'),
  plain('gta-5', 'lore', 'merryweather', 'Merryweather', 'Merryweather is a private military contractor in Grand Theft Auto V.'),
  plain('gta-online', 'vehicles', 'cheetah-classic', 'Grotti Cheetah Classic', 'The Grotti Cheetah Classic is a two-door sports classic.'),
  plain('gta-san-andreas', 'characters', 'carl-johnson', 'Carl Johnson', 'Carl Johnson, known as CJ, is the protagonist of San Andreas.'),
  plain('gta-san-andreas', 'locations', 'los-santos', 'Los Santos', 'Los Santos is the first city of San Andreas, based on Los Angeles.'),
  plain('gta-4', 'characters', 'niko-bellic', 'Niko Bellic', 'Niko Bellic is the protagonist of Grand Theft Auto IV.'),
  plain('gta-vice-city', 'characters', 'tommy-vercetti', 'Tommy Vercetti', 'Tommy Vercetti is the protagonist of Vice City.'),
  plain('gta-3', 'characters', 'claude', 'Claude', 'Claude is the silent protagonist of Grand Theft Auto III.'),
];

const CHANNELS: [string, string, string][] = [
  ['gta-vi-speculation', 'GTA VI speculation', 'Trailer breakdowns, theories and leak talk. Leaks go in their megathread, behind a spoiler tag.'],
  ['modding', 'Modding', 'Mods and tools for every game in the series.'],
  ['lore-and-easter-eggs', 'Lore and easter eggs', 'Hidden details and connections across the series.'],
  ['general', 'General GTA', 'Anything about the series.'],
  ['guides', 'Guides', 'Walkthroughs, tips and how-tos.'],
];
const TAGS = ['map-leak', 'trailer-2', 'theory', 'editions', 'vice-city', 'lucia', 'jason'];

const NEWS: [slug: string, game: string, title: string, excerpt: string, status: 'official', source: string, image: string, at: string][] = [
  ['preload-opens-12-november', 'gta-6', 'Preload for GTA VI opens on 12 November, a week before launch', 'Digital buyers on PS5 and Xbox Series X|S can download the game early.', 'official', 'Rockstar Games', 'bg/duo3.webp', '2026-11-04T09:00:00Z'],
  ['gta-vi-release-date', 'gta-6', 'GTA VI is set for 19 November 2026', 'Rockstar confirms the worldwide launch date on PS5 and Xbox Series X|S.', 'official', 'Rockstar Games', 'bg/hero.webp', '2025-11-06T17:00:00Z'],
  ['trailer-2', 'gta-6', 'Rockstar releases Grand Theft Auto VI Trailer 2', 'The second trailer shows more of Lucia, Jason and Vice City.', 'official', 'Rockstar Games', 'bg/motel.webp', '2025-05-06T16:00:00Z'],
  ['trailer-1', 'gta-6', 'Rockstar releases Grand Theft Auto VI Trailer 1', 'The first trailer confirms Vice City, the state of Leonida and Lucia.', 'official', 'Rockstar Games', 'bg/cover.webp', '2023-12-05T00:00:00Z'],
];

// Region positions follow the drawn map outline; they are approximate.
const REGIONS: [string, string, number, number][] = [
  ['vice-city', 'Vice City', 0.84, 0.66], ['leonida-keys', 'Leonida Keys', 0.62, 0.84], ['grassrivers', 'Grassrivers', 0.66, 0.63],
  ['port-gellhorn', 'Port Gellhorn', 0.13, 0.19], ['ambrosia', 'Ambrosia', 0.52, 0.3], ['mount-kalaga', 'Mount Kalaga', 0.32, 0.18],
];
const MODS: [string, string][] = [['engine', 'Engine'], ['brakes', 'Brakes'], ['transmission', 'Transmission'], ['suspension', 'Suspension'], ['armor', 'Armor'], ['turbo', 'Turbo'], ['livery', 'Livery'], ['wheels', 'Wheels']];
const VEHICLES: [game: string, slug: string, name: string, cls: string, img: string | null, seats: number][] = [
  ['gta-online', 'cheetah-classic', 'Grotti Cheetah Classic', 'Sports classic', 'editions/cheetah.webp', 2],
  ['gta-5', 'infernus', 'Pegassi Infernus', 'Super', null, 2],
  ['gta-5', 'zentorno', 'Pegassi Zentorno', 'Super', null, 2],
  ['gta-5', 'adder', 'Truffade Adder', 'Super', null, 2],
  ['gta-6', 'convertible', 'Convertible from the key art', 'Name unknown', 'bg/hero.webp', 2],
  ['gta-6', 'sport-bike', 'Sport bike, Trailer 1', 'Name unknown', 'characters/jason.webp', 2],
];

export async function seedFacts() {
  const gameId: Record<string, number> = {};
  for (const [i, [slug, name, shortName, year, universe, setting, leads, facts, summary, image, releaseAt]] of GAMES.entries()) {
    const values = { slug, name, shortName, year, universe, setting, leads, facts, summary, image, releaseAt, sortOrder: i };
    const [row] = await db.insert(games).values(values).onConflictDoUpdate({ target: games.slug, set: values }).returning({ id: games.id });
    gameId[slug] = row!.id;
  }
  for (const p of PAGES) {
    const game = gameId[p.game]!;
    const { game: _game, body, ...fields } = p;
    const values = { ...fields, gameId: game };
    const [page] = await db
      .insert(pages)
      .values(values)
      .onConflictDoUpdate({ target: [pages.gameId, pages.section, pages.slug], set: { title: p.title, summary: p.summary, status: p.status ?? null, source: p.source ?? null, image: p.image ?? null, infobox: p.infobox ?? [], gallery: p.gallery ?? [] } })
      .returning({ id: pages.id, current: pages.currentRevisionId });
    if (!page!.current) {
      const [rev] = await db.insert(revisions).values({ pageId: page!.id, body, summary: 'Page created', sourceKind: p.status ? 'official' : 'none', source: p.source, state: 'accepted', sizeDelta: body.length, closedAt: new Date() }).returning({ id: revisions.id });
      await db.update(pages).set({ currentRevisionId: rev!.id }).where(eq(pages.id, page!.id));
    }
  }
  for (const [i, [slug, name, description]] of CHANNELS.entries()) await db.insert(channels).values({ slug, name, description, sortOrder: i }).onConflictDoUpdate({ target: channels.slug, set: { name, description, sortOrder: i } });
  await db.insert(tags).values(TAGS.map(slug => ({ slug }))).onConflictDoNothing();
  for (const [slug, game, title, excerpt, status, source, image, at] of NEWS) {
    const values = { slug, gameId: gameId[game], title, excerpt, body: excerpt, status, source, image, publishedAt: new Date(at) };
    await db.insert(news).values(values).onConflictDoUpdate({ target: news.slug, set: values });
  }
  await db.insert(modCategories).values(MODS.map(([slug, name], sortOrder) => ({ slug, name, sortOrder }))).onConflictDoNothing();
  for (const [game, slug, name, cls, image, seats] of VEHICLES) {
    const page = await db.query.pages.findFirst({ where: and(eq(pages.gameId, gameId[game]!), eq(pages.slug, slug), eq(pages.section, 'vehicles')) });
    await db.insert(vehicles).values({ gameId: gameId[game]!, slug, name, class: cls, image, seats, pageId: page?.id }).onConflictDoNothing();
  }
  const gta6 = gameId['gta-6']!;
  const existing = await db.$count(mapMarkers, and(eq(mapMarkers.gameId, gta6), eq(mapMarkers.status, 'official')));
  if (!existing) {
    for (const [slug, title, x, y] of REGIONS) {
      const page = await db.query.pages.findFirst({ where: and(eq(pages.gameId, gta6), eq(pages.slug, slug)) });
      await db.insert(mapMarkers).values({ gameId: gta6, layer: 'trailer', title, description: page?.summary, x, y, status: 'official', source: 'Rockstar Games website', image: page?.image, pageId: page?.id });
    }
  }
  return gameId;
}

if (process.argv[1]?.endsWith('seed.ts')) {
  await seedFacts();
  const [{ n } = { n: 0 }] = await db.select({ n: dsql<number>`count(*)::int` }).from(pages);
  console.log(`seeded facts: ${n} pages`);
  await sql.end();
}
