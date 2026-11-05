// Facts only: safe to run in production. Sample users, votes and specs live in seed-sample.ts.
import 'dotenv/config';
import { and, eq, notInArray, sql as dsql } from 'drizzle-orm';
import videosData from '../../content/videos.json';
import { db, schema, sql } from './index';

const { games, pages, revisions, channels, tags, news, mapMarkers, modCategories, vehicles, videos, builds } = schema;

type Fact = { label: string; value: string };
type GameSeed = { slug: string; name: string; short: string; year: number; universe: 'hd' | '3d' | '2d'; setting: string; leads: string; facts?: Fact[]; summary?: string; image?: string; gallery?: string[]; releaseAt?: Date; pt?: { summary?: string; setting?: string; leads?: string; facts?: Fact[] } };

const GAMES: GameSeed[] = [
  {
    slug: 'gta-6', name: 'Grand Theft Auto VI', short: 'GTA VI', year: 2026, universe: 'hd', setting: 'Leonida', leads: 'Lucia Caminos, Jason Duval', image: 'art/key-01.webp', releaseAt: new Date('2026-11-19T00:00:00Z'),
    summary: 'Lucia and Jason, a criminal duo, are pulled into a conspiracy across the state of Leonida.',
    facts: [{ label: 'Release', value: '19 November 2026' }, { label: 'Developer', value: 'Rockstar Games' }, { label: 'Platforms', value: 'PS5, Xbox Series X|S' }, { label: 'Setting', value: 'State of Leonida, including Vice City' }, { label: 'Universe', value: 'HD universe' }],
    pt: { summary: 'Lucia e Jason, uma dupla criminosa, são arrastados para uma conspiração por todo o estado de Leonida.', facts: [{ label: 'Lançamento', value: '19 de novembro de 2026' }, { label: 'Desenvolvedora', value: 'Rockstar Games' }, { label: 'Plataformas', value: 'PS5, Xbox Series X|S' }, { label: 'Cenário', value: 'Estado de Leonida, incluindo Vice City' }, { label: 'Universo', value: 'Universo HD' }] },
  },
  {
    slug: 'gta-online', name: 'GTA Online', short: 'GTA Online', year: 2013, universe: 'hd', setting: 'Los Santos, Blaine County', leads: 'Your own character',
    summary: 'The online world of Grand Theft Auto V, updated for over a decade.',
    facts: [{ label: 'Released', value: '1 October 2013' }, { label: 'Developer', value: 'Rockstar North' }, { label: 'Setting', value: 'Los Santos and Blaine County' }, { label: 'Universe', value: 'HD universe' }],
    pt: { summary: 'O mundo online de Grand Theft Auto V, atualizado há mais de uma década.', leads: 'Seu próprio personagem', facts: [{ label: 'Lançamento', value: '1 de outubro de 2013' }, { label: 'Desenvolvedora', value: 'Rockstar North' }, { label: 'Cenário', value: 'Los Santos e Blaine County' }, { label: 'Universo', value: 'Universo HD' }] },
  },
  {
    slug: 'gta-5', name: 'Grand Theft Auto V', short: 'GTA V', year: 2013, universe: 'hd', setting: 'Los Santos, Blaine County', leads: 'Michael, Franklin, Trevor', image: 'games/gta-5/key-art.webp',
    gallery: ['trio-names', 'cover', 'trio-panels', 'the-hunt', 'the-desert', 'blitz-play', 'pest-control', 'preparation', 'the-trunk', 'by-land', 'by-sea', 'obey-9f', 'buzzard', 'vinewood', 'stop-and-frisk', 'starlet', 'beach-weather', 'lithograph'].map(name => `games/gta-5/${name}.webp`),
    summary: 'Michael, Franklin and Trevor run heists across Los Santos and Blaine County.',
    facts: [{ label: 'Released', value: '17 September 2013' }, { label: 'Developer', value: 'Rockstar North' }, { label: 'Platforms', value: 'PS3, Xbox 360, PS4, Xbox One, PC, PS5, Xbox Series X|S' }, { label: 'Setting', value: 'Los Santos and Blaine County, San Andreas' }, { label: 'Universe', value: 'HD universe' }],
    pt: { summary: 'Michael, Franklin e Trevor planejam golpes por Los Santos e Blaine County.', facts: [{ label: 'Lançamento', value: '17 de setembro de 2013' }, { label: 'Desenvolvedora', value: 'Rockstar North' }, { label: 'Plataformas', value: 'PS3, Xbox 360, PS4, Xbox One, PC, PS5, Xbox Series X|S' }, { label: 'Cenário', value: 'Los Santos e Blaine County, San Andreas' }, { label: 'Universo', value: 'Universo HD' }] },
  },
  { slug: 'gta-chinatown-wars', name: 'Chinatown Wars', short: 'Chinatown Wars', year: 2009, universe: 'hd', setting: 'Liberty City', leads: 'Huang Lee' },
  {
    slug: 'gta-4', name: 'Grand Theft Auto IV', short: 'GTA IV', year: 2008, universe: 'hd', setting: 'Liberty City', leads: 'Niko Bellic',
    summary: 'Niko Bellic arrives in Liberty City looking for a new life and the man who betrayed him.',
    facts: [{ label: 'Released', value: '29 April 2008' }, { label: 'Developer', value: 'Rockstar North' }, { label: 'Setting', value: 'Liberty City' }, { label: 'Universe', value: 'HD universe' }],
    pt: { summary: 'Niko Bellic chega a Liberty City em busca de uma vida nova e do homem que o traiu.', facts: [{ label: 'Lançamento', value: '29 de abril de 2008' }, { label: 'Desenvolvedora', value: 'Rockstar North' }, { label: 'Cenário', value: 'Liberty City' }, { label: 'Universo', value: 'Universo HD' }] },
  },
  { slug: 'gta-vice-city-stories', name: 'Vice City Stories', short: 'Vice City Stories', year: 2006, universe: '3d', setting: 'Vice City', leads: 'Victor Vance' },
  { slug: 'gta-liberty-city-stories', name: 'Liberty City Stories', short: 'Liberty City Stories', year: 2005, universe: '3d', setting: 'Liberty City', leads: 'Toni Cipriani' },
  {
    slug: 'gta-san-andreas', name: 'San Andreas', short: 'GTA San Andreas', year: 2004, universe: '3d', setting: 'Los Santos, San Fierro, Las Venturas', leads: 'Carl Johnson',
    summary: 'Carl Johnson returns to Los Santos after his mother is killed.',
    facts: [{ label: 'Released', value: '26 October 2004' }, { label: 'Developer', value: 'Rockstar North' }, { label: 'Setting', value: 'State of San Andreas' }, { label: 'Universe', value: '3D universe' }],
    pt: { summary: 'Carl Johnson volta a Los Santos depois que sua mãe é assassinada.', facts: [{ label: 'Lançamento', value: '26 de outubro de 2004' }, { label: 'Desenvolvedora', value: 'Rockstar North' }, { label: 'Cenário', value: 'Estado de San Andreas' }, { label: 'Universo', value: 'Universo 3D' }] },
  },
  { slug: 'gta-advance', name: 'Advance', short: 'GTA Advance', year: 2004, universe: '3d', setting: 'Liberty City', leads: 'Mike' },
  {
    slug: 'gta-vice-city', name: 'Vice City', short: 'GTA Vice City', year: 2002, universe: '3d', setting: 'Vice City', leads: 'Tommy Vercetti',
    summary: 'Tommy Vercetti builds a criminal empire in 1980s Vice City.',
    facts: [{ label: 'Released', value: '29 October 2002' }, { label: 'Developer', value: 'Rockstar North' }, { label: 'Setting', value: 'Vice City, 1986' }, { label: 'Universe', value: '3D universe' }],
    pt: { summary: 'Tommy Vercetti constrói um império criminoso na Vice City dos anos 80.', facts: [{ label: 'Lançamento', value: '29 de outubro de 2002' }, { label: 'Desenvolvedora', value: 'Rockstar North' }, { label: 'Cenário', value: 'Vice City, 1986' }, { label: 'Universo', value: 'Universo 3D' }] },
  },
  {
    slug: 'gta-3', name: 'Grand Theft Auto III', short: 'GTA III', year: 2001, universe: '3d', setting: 'Liberty City', leads: 'Claude',
    summary: 'The first 3D game in the series.',
    facts: [{ label: 'Released', value: '22 October 2001' }, { label: 'Developer', value: 'DMA Design' }, { label: 'Setting', value: 'Liberty City' }, { label: 'Universe', value: '3D universe' }],
    pt: { summary: 'O primeiro jogo em 3D da série.', facts: [{ label: 'Lançamento', value: '22 de outubro de 2001' }, { label: 'Desenvolvedora', value: 'DMA Design' }, { label: 'Cenário', value: 'Liberty City' }, { label: 'Universo', value: 'Universo 3D' }] },
  },
  { slug: 'gta-2', name: 'Grand Theft Auto 2', short: 'GTA 2', year: 1999, universe: '2d', setting: 'Anywhere City', leads: 'Claude Speed' },
  { slug: 'gta-london-1969', name: 'London 1969', short: 'London 1969', year: 1999, universe: '2d', setting: 'London', leads: 'Unnamed criminal', pt: { setting: 'Londres', leads: 'Criminoso sem nome' } },
  { slug: 'gta-1', name: 'Grand Theft Auto', short: 'GTA', year: 1997, universe: '2d', setting: 'Liberty City, San Andreas, Vice City', leads: 'Eight selectable characters', pt: { leads: 'Oito personagens selecionáveis' } },
];

type Sec = 'characters' | 'vehicles' | 'locations' | 'guides' | 'lore';
type Row = { label: string; value: string };
type PageSeed = { game: string; section: Sec; slug: string; title: string; summary: string; body: string; status?: 'official'; source?: string; image?: string; video?: string; gallery?: string[]; infobox?: Row[]; pt?: { title?: string; summary: string; body: string; infobox?: Row[]; source?: string } };

const range = (dir: string, n: number) => Array.from({ length: n }, (_, i) => `${dir}/${String(i + 1).padStart(2, '0')}.webp`);
const SRC6 = 'Rockstar Games character profiles';
const SRC6_PT = 'Perfis de personagens da Rockstar Games';
const DUO = range('people/jason-and-lucia', 13);

function char6(slug: string, title: string, role: [string, string], video: string, image: string, gallery: string[], summary: [string, string], bio: [string, string], extra?: Partial<PageSeed>): PageSeed {
  return {
    game: 'gta-6', section: 'characters', slug, title, summary: summary[0], status: 'official', source: SRC6, image, video, gallery,
    body: `${summary[0]}\n\n## Biography\n\n${bio[0]}\n\n## References\n\n1. Grand Theft Auto VI character profiles, Rockstar Games website.`,
    infobox: [{ label: 'Role', value: role[0] }, { label: 'Home', value: 'Leonida' }, { label: 'Game', value: 'Grand Theft Auto VI' }],
    pt: { source: SRC6_PT, summary: summary[1], body: `${summary[1]}\n\n## Biografia\n\n${bio[1]}\n\n## Referências\n\n1. Perfis de personagens de Grand Theft Auto VI, site da Rockstar Games.`, infobox: [{ label: 'Papel', value: role[1] }, { label: 'Lar', value: 'Leonida' }, { label: 'Jogo', value: 'Grand Theft Auto VI' }] },
    ...extra,
  };
}
function region(slug: string, title: string, dir: string, shots: number, summary: [string, string]): PageSeed {
  return {
    game: 'gta-6', section: 'locations', slug, title, summary: summary[0], status: 'official', source: 'Rockstar Games website', image: `places/postcards/${dir}.webp`, gallery: range(`places/${dir}`, shots),
    body: `${summary[0]}\n\n## References\n\n1. Grand Theft Auto VI locations, Rockstar Games website.`,
    infobox: [{ label: 'State', value: 'Leonida' }, { label: 'Game', value: 'Grand Theft Auto VI' }],
    pt: { source: 'Site da Rockstar Games', summary: summary[1], body: `${summary[1]}\n\n## Referências\n\n1. Locais de Grand Theft Auto VI, site da Rockstar Games.`, infobox: [{ label: 'Estado', value: 'Leonida' }, { label: 'Jogo', value: 'Grand Theft Auto VI' }] },
  };
}
const UE = (name: string, n: number) => range('x', n).map((_, i) => `editions/ultimate/${name}-${String(i + 1).padStart(2, '0')}.webp`);
function pack6(slug: string, title: string, pack: 'ultimate' | 'vintage', image: string, gallery: string[]): PageSeed {
  const en = pack === 'ultimate' ? 'Ultimate Edition' : 'Vintage Vice City Pack';
  const pt = pack === 'ultimate' ? 'Edição Ultimate' : 'Pacote Vintage Vice City';
  const link = pack === 'ultimate' ? 'ultimate-edition' : 'vintage-vice-city-pack';
  return {
    game: 'gta-6', section: 'vehicles', slug, title, status: 'official', source: 'Rockstar Games', image, gallery,
    summary: `${title} is a vehicle shown in the official ${en} images for Grand Theft Auto VI.`,
    body: `${title} is a vehicle shown in the official ${en} images for Grand Theft Auto VI.\n\nSee the [${en}](/gta-6/guides/${link}) guide for everything in the pack. Specs will be added after in-game testing.`,
    infobox: [{ label: 'Comes with', value: en }, { label: 'Game', value: 'Grand Theft Auto VI' }],
    pt: { summary: `${title} é um veículo mostrado nas imagens oficiais da ${pt} de Grand Theft Auto VI.`, body: `${title} é um veículo mostrado nas imagens oficiais da ${pt} de Grand Theft Auto VI.\n\nVeja o guia [${pt}](/gta-6/guides/${link}) para conhecer tudo o que vem no pacote. As especificações serão adicionadas depois dos testes no jogo.`, infobox: [{ label: 'Vem com', value: pt }, { label: 'Jogo', value: 'Grand Theft Auto VI' }] },
  };
}
function plain(game: string, section: Sec, slug: string, title: string, en: string, pt: string, image?: string, gallery?: string[]): PageSeed {
  return { game, section, slug, title, summary: en, body: en, image, gallery, pt: { summary: pt, body: pt } };
}
const art5 = (...names: string[]) => names.map(name => `games/gta-5/${name}.webp`);
const person5 = (slug: string, title: string, en: string, pt: string, ...names: string[]) => plain('gta-5', 'characters', slug, title, en, pt, art5(names[0]!)[0], art5(...names));

const PAGES: PageSeed[] = [
  char6('lucia', 'Lucia Caminos', ['Protagonist', 'Protagonista'], 'lucia', 'people/lucia-caminos/10.webp', [...range('people/lucia-caminos', 10), ...DUO.slice(0, 6)],
    ['Lucia Caminos is one of the two protagonists of Grand Theft Auto VI, alongside Jason Duval. She first appears in Trailer 1, in the Leonida Penitentiary.', 'Lucia Caminos é uma das duas protagonistas de Grand Theft Auto VI, ao lado de Jason Duval. Ela aparece pela primeira vez no Trailer 1, na Penitenciária de Leonida.'],
    ['Rockstar describes Lucia as someone whose father taught her to fight as soon as she could walk. Fighting for her family landed her in the Leonida Penitentiary, and sheer luck got her out.\n\nAfter her release she teams up with Jason, and the pair are pulled into a criminal conspiracy that stretches across the state.\n\n## Appearances\n\n| Where | When |\n| --- | --- |\n| Trailer 1 | 5 December 2023 |\n| Trailer 2 | 6 May 2025 |', 'A Rockstar descreve Lucia como alguém que aprendeu a lutar com o pai assim que começou a andar. Lutar pela família a levou à Penitenciária de Leonida, e foi pura sorte que a tirou de lá.\n\nDepois de sair, ela se une a Jason, e os dois são arrastados para uma conspiração criminosa que se espalha por todo o estado.\n\n## Aparições\n\n| Onde | Quando |\n| --- | --- |\n| Trailer 1 | 5 de dezembro de 2023 |\n| Trailer 2 | 6 de maio de 2025 |'],
    { infobox: [{ label: 'Status', value: 'Playable' }, { label: 'Home', value: 'Leonida' }, { label: 'First seen', value: 'Trailer 1, 5 Dec 2023' }, { label: 'Associates', value: 'Jason Duval' }, { label: 'Voice actor', value: 'Not announced' }] }),
  char6('jason', 'Jason Duval', ['Protagonist', 'Protagonista'], 'jason', 'people/jason-duval/04.webp', [...range('people/jason-duval', 10), ...DUO.slice(6)],
    ['Jason Duval is one of the two protagonists of Grand Theft Auto VI, alongside Lucia Caminos.', 'Jason Duval é um dos dois protagonistas de Grand Theft Auto VI, ao lado de Lucia Caminos.'],
    ['Rockstar describes Jason as someone who wants an easy life while things keep getting harder. He grew up around grifters and crooks, and after a stint in the Army he ended up in the Leonida Keys working for local drug runners.', 'A Rockstar descreve Jason como alguém que quer uma vida fácil enquanto tudo só fica mais difícil. Ele cresceu cercado de golpistas e bandidos e, depois de passar pelo Exército, foi parar em Leonida Keys trabalhando para traficantes locais.']),
  char6('cal-hampton', 'Cal Hampton', ['Jason’s friend', 'Amigo de Jason'], 'cal', 'art/characters/cal.webp', range('people/cal-hampton', 4),
    ['Cal Hampton is Jason’s friend and a fellow associate of Brian Heder.', 'Cal Hampton é amigo de Jason e também trabalha com Brian Heder.'],
    ['Cal is happiest at home, deep in conspiracy theories, and he works alongside Jason for Brian Heder.', 'Cal é mais feliz em casa, mergulhado em teorias da conspiração, e trabalha ao lado de Jason para Brian Heder.']),
  char6('boobie-ike', 'Boobie Ike', ['Only Raw Records', 'Only Raw Records'], 'boobie', 'art/characters/boobie.webp', range('people/boobie-ike', 4),
    ['Boobie Ike is a Vice City local legend with interests in property, a strip club and Only Raw Records.', 'Boobie Ike é uma lenda local de Vice City, com negócios em imóveis, uma boate e a Only Raw Records.'],
    ['Boobie runs his businesses out of Vice City and co-owns the label Only Raw Records with Dre’Quan Priest.', 'Boobie comanda seus negócios a partir de Vice City e é sócio da gravadora Only Raw Records com Dre’Quan Priest.']),
  char6('drequan-priest', 'Dre’Quan Priest', ['Only Raw Records', 'Only Raw Records'], 'drequan', 'art/characters/drequan.webp', range('people/drequan-priest', 4),
    ['Dre’Quan Priest is a partner in Only Raw Records.', 'Dre’Quan Priest é sócio da Only Raw Records.'],
    ['Dre’Quan moved from street hustling into music, and he signed the duo Real Dimez to Only Raw Records.', 'Dre’Quan trocou a vida nas ruas pela música e contratou a dupla Real Dimez para a Only Raw Records.']),
  char6('real-dimez', 'Real Dimez', ['Rap duo', 'Dupla de rap'], 'real_dimez', 'art/characters/real_dimez.webp', range('people/real-dimez', 4),
    ['Real Dimez is the rap duo of Bae-Luxe and Roxy, signed to Only Raw Records.', 'Real Dimez é a dupla de rap formada por Bae-Luxe e Roxy, contratada pela Only Raw Records.'],
    ['Bae-Luxe and Roxy have been friends since high school and work together as Real Dimez.', 'Bae-Luxe e Roxy são amigas desde o colégio e trabalham juntas como Real Dimez.']),
  char6('raul-bautista', 'Raul Bautista', ['Bank robber', 'Assaltante de bancos'], 'raul', 'art/characters/raul.webp', range('people/raul-bautista', 4),
    ['Raul Bautista is a seasoned bank robber who looks for talent willing to take big risks.', 'Raul Bautista é um assaltante de bancos experiente, sempre em busca de talentos dispostos a correr grandes riscos.'],
    ['Rockstar presents Raul as confident and cunning, always hunting for people ready to take the risks that bring the biggest rewards.', 'A Rockstar apresenta Raul como confiante e astuto, sempre à procura de quem aceite os riscos que trazem as maiores recompensas.']),
  char6('brian-heder', 'Brian Heder', ['Drug runner', 'Traficante'], 'brian', 'art/characters/brian.webp', range('people/brian-heder', 4),
    ['Brian Heder is a veteran drug runner in the Leonida Keys.', 'Brian Heder é um traficante veterano de Leonida Keys.'],
    ['Brian has been smuggling since the golden age of the trade in the Keys, and he has Jason doing his dirty work.', 'Brian faz contrabando desde a era de ouro do negócio em Keys e coloca Jason para fazer o trabalho sujo.']),
  region('vice-city', 'Vice City', 'vice-city', 12, ['Vice City is the largest city in Leonida, known for its beaches, nightlife and sun.', 'Vice City é a maior cidade de Leonida, conhecida pelas praias, pela vida noturna e pelo sol.']),
  region('leonida-keys', 'Leonida Keys', 'leonida-keys', 6, ['The Leonida Keys are an island chain off the southern tip of the state.', 'Leonida Keys é uma cadeia de ilhas no extremo sul do estado.']),
  region('grassrivers', 'Grassrivers', 'grassrivers', 6, ['Grassrivers is the wetland region in the south of Leonida.', 'Grassrivers é a região de pântanos no sul de Leonida.']),
  region('port-gellhorn', 'Port Gellhorn', 'port-gellhorn', 6, ['Port Gellhorn is a faded resort town on the Leonida coast.', 'Port Gellhorn é uma cidade turística decadente no litoral de Leonida.']),
  region('ambrosia', 'Ambrosia', 'ambrosia', 6, ['Ambrosia is an inland area of Leonida built around sugar production.', 'Ambrosia é uma região do interior de Leonida construída em torno da produção de açúcar.']),
  region('mount-kalaga', 'Mount Kalaga', 'mount-kalaga-national-park', 6, ['Mount Kalaga is the mountainous national park in the north of Leonida.', 'Mount Kalaga é o parque nacional montanhoso no norte de Leonida.']),
  {
    game: 'gta-6', section: 'guides', slug: 'release-date-and-editions', title: 'Release date and editions', status: 'official', source: 'Rockstar Games', image: 'art/cover.webp', gallery: ['editions/ultimate/01.webp', 'editions/ultimate/02.webp', 'editions/vintage/pack-01.webp', 'editions/vintage/pack-02.webp'],
    summary: 'Grand Theft Auto VI launches worldwide on 19 November 2026 on PS5 and Xbox Series X|S. Digital preload opens on 12 November.',
    body: 'Grand Theft Auto VI launches worldwide on 19 November 2026 on PS5 and Xbox Series X|S. Digital preload opens on 12 November.\n\nNo PC version has a date yet.\n\n## Editions\n\n| Edition | What it includes |\n| --- | --- |\n| Standard Edition | The full game |\n| [Ultimate Edition](/gta-6/guides/ultimate-edition) | Everything in the Standard Edition, an exclusive vehicle collection, premium weapons and apparel, and 1 free month of GTA+ |\n\n## Pre-order bonus\n\n- [Vintage Vice City Pack](/gta-6/guides/vintage-vice-city-pack)\n- 1 free month of GTA+ on digital pre-orders',
    pt: {
      title: 'Data de lançamento e edições',
      summary: 'Grand Theft Auto VI será lançado no mundo todo em 19 de novembro de 2026, para PS5 e Xbox Series X|S. O pré-carregamento digital abre em 12 de novembro.',
      body: 'Grand Theft Auto VI será lançado no mundo todo em 19 de novembro de 2026, para PS5 e Xbox Series X|S. O pré-carregamento digital abre em 12 de novembro.\n\nA versão para PC ainda não tem data.\n\n## Edições\n\n| Edição | O que inclui |\n| --- | --- |\n| Edição Padrão | O jogo completo |\n| [Edição Ultimate](/gta-6/guides/ultimate-edition) | Tudo da Edição Padrão, uma coleção exclusiva de veículos, armas e roupas premium e 1 mês grátis de GTA+ |\n\n## Bônus de pré-venda\n\n- [Pacote Vintage Vice City](/gta-6/guides/vintage-vice-city-pack)\n- 1 mês grátis de GTA+ em pré-vendas digitais',
    },
  },
  {
    game: 'gta-6', section: 'guides', slug: 'ultimate-edition', title: 'Ultimate Edition', status: 'official', source: 'Rockstar Games', image: 'editions/ultimate/01.webp',
    gallery: ['editions/ultimate/01.webp', 'editions/ultimate/02.webp', ...UE('grotti-cheetah', 4), ...UE('vapid-buggy', 4), ...UE('one-eyed-willie', 3), ...UE('squalo', 4), ...UE('rideout-customs', 3), 'editions/ultimate/vapid-ganado-retro-build-01.webp', ...UE('wyman-car-collection', 6), ...UE('safehouse-vehicles', 3), ...UE('electric-fang', 4), ...UE('saras-salon', 3), ...UE('stock-305', 4), 'editions/ultimate/goodtime-gear-01.webp', 'editions/ultimate/ptt-store-01.webp', ...UE('vice-city-style', 5), ...UE('hawk-and-little-morgan-revolvers', 2), 'editions/ultimate/weapon-variants-01.webp'],
    summary: 'The Ultimate Edition of Grand Theft Auto VI includes everything in the Standard Edition, an exclusive vehicle collection, premium weapons and apparel, and 1 free month of GTA+.',
    body: 'The Ultimate Edition of Grand Theft Auto VI includes everything in the Standard Edition, an exclusive vehicle collection, premium weapons and apparel, and 1 free month of GTA+.\n\n## Vehicles\n\n- [Grotti Cheetah](/gta-6/vehicles/grotti-cheetah)\n- [Vapid Buggy](/gta-6/vehicles/vapid-buggy)\n- [One-Eyed Willie](/gta-6/vehicles/one-eyed-willie)\n- [Squalo](/gta-6/vehicles/squalo)\n- Vapid Ganado retro build\n- Wyman Car Collection\n- Rideout Customs\n- Safehouse vehicles\n\n## Places and shops\n\n- Electric Fang\n- Sara’s Salon\n- Stock 305\n- Goodtime Gear\n- PTT Store\n\n## Style and weapons\n\n- Vice City Style\n- Hawk & Little Morgan revolvers\n- Weapon variants',
    pt: {
      title: 'Edição Ultimate',
      summary: 'A Edição Ultimate de Grand Theft Auto VI inclui tudo da Edição Padrão, uma coleção exclusiva de veículos, armas e roupas premium e 1 mês grátis de GTA+.',
      body: 'A Edição Ultimate de Grand Theft Auto VI inclui tudo da Edição Padrão, uma coleção exclusiva de veículos, armas e roupas premium e 1 mês grátis de GTA+.\n\n## Veículos\n\n- [Grotti Cheetah](/gta-6/vehicles/grotti-cheetah)\n- [Vapid Buggy](/gta-6/vehicles/vapid-buggy)\n- [One-Eyed Willie](/gta-6/vehicles/one-eyed-willie)\n- [Squalo](/gta-6/vehicles/squalo)\n- Vapid Ganado, versão retrô\n- Coleção de carros Wyman\n- Rideout Customs\n- Veículos do esconderijo\n\n## Lugares e lojas\n\n- Electric Fang\n- Sara’s Salon\n- Stock 305\n- Goodtime Gear\n- PTT Store\n\n## Estilo e armas\n\n- Vice City Style\n- Revólveres Hawk & Little Morgan\n- Variantes de armas',
    },
  },
  {
    game: 'gta-6', section: 'guides', slug: 'vintage-vice-city-pack', title: 'Vintage Vice City Pack', status: 'official', source: 'Rockstar Games', image: 'editions/vintage/pack-01.webp',
    gallery: ['editions/vintage/pack-01.webp', 'editions/vintage/pack-02.webp', ...[1, 2, 3, 4, 5].map(i => `editions/vintage/pack-exclusive-looks-0${i}.webp`), ...[1, 2, 3, 4].map(i => `editions/vintage/pack-vapid-stanier-0${i}.webp`), 'editions/vintage/weapon-pattern-01.webp'],
    summary: 'The Vintage Vice City Pack is the pre-order bonus for Grand Theft Auto VI.',
    body: 'The Vintage Vice City Pack is the pre-order bonus for Grand Theft Auto VI.\n\n## What it shows\n\n- Exclusive looks\n- [Vapid Stanier](/gta-6/vehicles/vapid-stanier)\n- A weapon pattern',
    pt: { title: 'Pacote Vintage Vice City', summary: 'O Pacote Vintage Vice City é o bônus de pré-venda de Grand Theft Auto VI.', body: 'O Pacote Vintage Vice City é o bônus de pré-venda de Grand Theft Auto VI.\n\n## O que aparece\n\n- Visuais exclusivos\n- [Vapid Stanier](/gta-6/vehicles/vapid-stanier)\n- Uma estampa de arma' },
  },
  pack6('grotti-cheetah', 'Grotti Cheetah', 'ultimate', 'editions/ultimate/grotti-cheetah-01.webp', UE('grotti-cheetah', 4)),
  pack6('vapid-buggy', 'Vapid Buggy', 'ultimate', 'editions/ultimate/vapid-buggy-01.webp', UE('vapid-buggy', 4)),
  pack6('one-eyed-willie', 'One-Eyed Willie', 'ultimate', 'editions/ultimate/one-eyed-willie-01.webp', UE('one-eyed-willie', 3)),
  pack6('squalo', 'Squalo', 'ultimate', 'editions/ultimate/squalo-01.webp', UE('squalo', 4)),
  pack6('vapid-stanier', 'Vapid Stanier', 'vintage', 'editions/vintage/pack-vapid-stanier-01.webp', [1, 2, 3, 4].map(i => `editions/vintage/pack-vapid-stanier-0${i}.webp`)),
  person5('michael-de-santa', 'Michael De Santa', 'Michael De Santa is a retired bank robber living in Rockford Hills under witness protection, and one of the three protagonists of Grand Theft Auto V.', 'Michael De Santa é um assaltante de bancos aposentado que vive em Rockford Hills sob proteção a testemunhas, e um dos três protagonistas de Grand Theft Auto V.', 'michael-01', 'michael-02', 'michael-03', 'michael-04', 'michael-robbery', 'vinewood', 'preparation'),
  person5('franklin-clinton', 'Franklin Clinton', 'Franklin Clinton is a repo man from Strawberry and one of the three protagonists of Grand Theft Auto V.', 'Franklin Clinton é um retomador de carros de Strawberry e um dos três protagonistas de Grand Theft Auto V.', 'franklin-01', 'franklin-02', 'franklin-03', 'franklin-04', 'franklin-and-chop'),
  person5('trevor-philips', 'Trevor Philips', 'Trevor Philips is Michael’s former partner, living in Blaine County, and one of the three protagonists of Grand Theft Auto V.', 'Trevor Philips é o antigo parceiro de Michael, vive em Blaine County e é um dos três protagonistas de Grand Theft Auto V.', 'trevor-01', 'trevor-02', 'trevor-03', 'trevor-04', 'trevor-05'),
  person5('lamar-davis', 'Lamar Davis', 'Lamar Davis is Franklin’s best friend from Chamberlain Hills.', 'Lamar Davis é o melhor amigo de Franklin, de Chamberlain Hills.', 'lamar'),
  person5('amanda-de-santa', 'Amanda De Santa', 'Amanda De Santa is Michael\u2019s wife and the mother of Jimmy and Tracey.', 'Amanda De Santa é a esposa de Michael e mãe de Jimmy e Tracey.', 'amanda'),
  person5('jimmy-de-santa', 'Jimmy De Santa', 'Jimmy De Santa is the son of Michael and Amanda De Santa.', 'Jimmy De Santa é filho de Michael e Amanda De Santa.', 'tracey-and-jimmy'),
  person5('tracey-de-santa', 'Tracey De Santa', 'Tracey De Santa is the daughter of Michael and Amanda De Santa.', 'Tracey De Santa é filha de Michael e Amanda De Santa.', 'tracey', 'tracey-and-jimmy'),
  person5('lester-crest', 'Lester Crest', 'Lester Crest is Michael\u2019s old friend and the planner behind the crew\u2019s heists.', 'Lester Crest é um velho amigo de Michael e quem planeja os golpes do grupo.', 'lester'),
  person5('chop', 'Chop', 'Chop is the Rottweiler who stays with Franklin.', 'Chop é o rottweiler que fica com Franklin.', 'chop', 'franklin-and-chop'),
  person5('dave-norton', 'Dave Norton', 'Dave Norton is the FIB agent who helped Michael fake his death.', 'Dave Norton é o agente do FIB que ajudou Michael a forjar a própria morte.', 'dave-norton'),
  person5('isiah-friedlander', 'Dr. Isiah Friedlander', 'Dr. Isiah Friedlander is Michael\u2019s psychiatrist.', 'Dr. Isiah Friedlander é o psiquiatra de Michael.', 'friedlander'),
  person5('simeon-yetarian', 'Simeon Yetarian', 'Simeon Yetarian owns Premium Deluxe Motorsport, the dealership where Franklin works at the start of the game.', 'Simeon Yetarian é dono da Premium Deluxe Motorsport, a concessionária onde Franklin trabalha no início do jogo.', 'simeon'),
  person5('tonya-wiggins', 'Tonya Wiggins', 'Tonya Wiggins is a friend of Franklin who asks him for help with tow truck jobs.', 'Tonya Wiggins é uma amiga de Franklin que pede ajuda com serviços de guincho.', 'tonya'),
  person5('wade-hebert', 'Wade Hebert', 'Wade Hebert is Trevor\u2019s loyal associate in Blaine County.', 'Wade Hebert é o parceiro leal de Trevor em Blaine County.', 'wade'),
  person5('nervous-ron', 'Nervous Ron', 'Nervous Ron is Trevor\u2019s paranoid associate in Blaine County.', 'Nervous Ron é o parceiro paranoico de Trevor em Blaine County.', 'nervous-ron'),
  person5('maude', 'Maude', 'Maude is a bail bond agent who hires Trevor to catch fugitives.', 'Maude é uma agente de fianças que contrata Trevor para capturar fugitivos.', 'maude'),
  person5('tao-cheng', 'Tao Cheng', 'Tao Cheng is the son of Triad leader Wei Cheng.', 'Tao Cheng é filho do líder da Tríade Wei Cheng.', 'tao-cheng'),
  plain('gta-5', 'vehicles', 'infernus', 'Pegassi Infernus', 'The Pegassi Infernus is a two-door super car.', 'O Pegassi Infernus é um superesportivo de duas portas.'),
  plain('gta-5', 'vehicles', 'zentorno', 'Pegassi Zentorno', 'The Pegassi Zentorno is a two-door super car.', 'O Pegassi Zentorno é um superesportivo de duas portas.'),
  plain('gta-5', 'vehicles', 'adder', 'Truffade Adder', 'The Truffade Adder is a two-door super car.', 'O Truffade Adder é um superesportivo de duas portas.'),
  plain('gta-5', 'vehicles', 'obey-9f', 'Obey 9F', 'The Obey 9F is a two-door sports car.', 'O Obey 9F é um carro esportivo de duas portas.', art5('obey-9f')[0], art5('obey-9f')),
  plain('gta-5', 'vehicles', 'buzzard', 'Nagasaki Buzzard', 'The Nagasaki Buzzard is an attack helicopter.', 'O Nagasaki Buzzard é um helicóptero de ataque.', art5('buzzard')[0], art5('buzzard')),
  plain('gta-5', 'locations', 'los-santos', 'Los Santos', 'Los Santos is the city at the centre of Grand Theft Auto V.', 'Los Santos é a cidade no centro de Grand Theft Auto V.', art5('vinewood')[0], art5('vinewood', 'michael-04', 'beach-weather', 'by-sea', 'starlet')),
  plain('gta-5', 'locations', 'blaine-county', 'Blaine County', 'Blaine County is the rural region north of Los Santos.', 'Blaine County é a região rural ao norte de Los Santos.', art5('the-desert')[0], art5('the-desert', 'trevor-02', 'trevor-03', 'trevor-04', 'tao-cheng')),
  plain('gta-5', 'locations', 'mount-chiliad', 'Mount Chiliad', 'Mount Chiliad is the tallest mountain in Blaine County.', 'Mount Chiliad é a montanha mais alta de Blaine County.'),
  { ...plain('gta-5', 'guides', 'cheat-codes', 'Cheat codes', 'Cheat codes for Grand Theft Auto V by platform.', 'Códigos de trapaça de Grand Theft Auto V por plataforma.'), pt: { title: 'Códigos de trapaça', summary: 'Códigos de trapaça de Grand Theft Auto V por plataforma.', body: 'Códigos de trapaça de Grand Theft Auto V por plataforma.' } },
  { ...plain('gta-5', 'guides', 'spaceship-parts', 'Spaceship parts', 'All 50 spaceship parts collected for Omega in Grand Theft Auto V.', 'As 50 peças de nave coletadas para Omega em Grand Theft Auto V.'), pt: { title: 'Peças de nave', summary: 'As 50 peças de nave coletadas para Omega em Grand Theft Auto V.', body: 'As 50 peças de nave coletadas para Omega em Grand Theft Auto V.' } },
  plain('gta-5', 'lore', 'epsilon-program', 'Epsilon Program', 'The Epsilon Program is a religious movement parodied in the series.', 'O Programa Epsilon é um movimento religioso satirizado na série.'),
  plain('gta-5', 'lore', 'merryweather', 'Merryweather', 'Merryweather is a private military contractor in Grand Theft Auto V.', 'Merryweather é uma empresa militar privada em Grand Theft Auto V.'),
  plain('gta-online', 'vehicles', 'cheetah-classic', 'Grotti Cheetah Classic', 'The Grotti Cheetah Classic is a two-door sports classic.', 'O Grotti Cheetah Classic é um esportivo clássico de duas portas.'),
  plain('gta-san-andreas', 'characters', 'carl-johnson', 'Carl Johnson', 'Carl Johnson, known as CJ, is the protagonist of San Andreas.', 'Carl Johnson, conhecido como CJ, é o protagonista de San Andreas.'),
  plain('gta-san-andreas', 'locations', 'los-santos', 'Los Santos', 'Los Santos is the first city of San Andreas, based on Los Angeles.', 'Los Santos é a primeira cidade de San Andreas, inspirada em Los Angeles.'),
  plain('gta-4', 'characters', 'niko-bellic', 'Niko Bellic', 'Niko Bellic is the protagonist of Grand Theft Auto IV.', 'Niko Bellic é o protagonista de Grand Theft Auto IV.'),
  plain('gta-vice-city', 'characters', 'tommy-vercetti', 'Tommy Vercetti', 'Tommy Vercetti is the protagonist of Vice City.', 'Tommy Vercetti é o protagonista de Vice City.'),
  plain('gta-3', 'characters', 'claude', 'Claude', 'Claude is the silent protagonist of Grand Theft Auto III.', 'Claude é o protagonista silencioso de Grand Theft Auto III.'),
];

const CHANNELS: [slug: string, name: string, description: string, pt: { name: string; description: string }][] = [
  ['gta-vi-speculation', 'GTA VI speculation', 'Trailer breakdowns, theories and leak talk. Leaks go in their megathread, behind a spoiler tag.', { name: 'Especulação sobre GTA VI', description: 'Análises de trailers, teorias e conversas sobre vazamentos. Vazamentos ficam no megatópico, com marcação de spoiler.' }],
  ['modding', 'Modding', 'Mods and tools for every game in the series.', { name: 'Mods', description: 'Mods e ferramentas para todos os jogos da série.' }],
  ['lore-and-easter-eggs', 'Lore and easter eggs', 'Hidden details and connections across the series.', { name: 'História e easter eggs', description: 'Detalhes escondidos e conexões entre os jogos da série.' }],
  ['general', 'General GTA', 'Anything about the series.', { name: 'GTA em geral', description: 'Qualquer assunto sobre a série.' }],
  ['guides', 'Guides', 'Walkthroughs, tips and how-tos.', { name: 'Guias', description: 'Detonados, dicas e tutoriais.' }],
];
const TAGS = ['map-leak', 'trailer-2', 'theory', 'editions', 'vice-city', 'lucia', 'jason'];

const NEWS: { slug: string; title: string; excerpt: string; source: string; image: string; at: string; pt: { title: string; excerpt: string; body: string } }[] = [
  { slug: 'preload-opens-12-november', title: 'Preload for GTA VI opens on 12 November, a week before launch', excerpt: 'Digital buyers on PS5 and Xbox Series X|S can download the game early.', source: 'Rockstar Games', image: 'art/key-beach.webp', at: '2026-11-04T09:00:00Z', pt: { title: 'Pré-carregamento de GTA VI abre em 12 de novembro, uma semana antes do lançamento', excerpt: 'Quem comprar a versão digital para PS5 e Xbox Series X|S pode baixar o jogo antes.', body: 'Quem comprar a versão digital para PS5 e Xbox Series X|S pode baixar o jogo antes.' } },
  { slug: 'gta-vi-release-date', title: 'GTA VI is set for 19 November 2026', excerpt: 'Rockstar confirms the worldwide launch date on PS5 and Xbox Series X|S.', source: 'Rockstar Games', image: 'art/key-01.webp', at: '2025-11-06T17:00:00Z', pt: { title: 'GTA VI chega em 19 de novembro de 2026', excerpt: 'A Rockstar confirma a data de lançamento mundial para PS5 e Xbox Series X|S.', body: 'A Rockstar confirma a data de lançamento mundial para PS5 e Xbox Series X|S.' } },
  { slug: 'trailer-2', title: 'Rockstar releases Grand Theft Auto VI Trailer 2', excerpt: 'The second trailer shows more of Lucia, Jason and Vice City.', source: 'Rockstar Games', image: 'art/key-motel.webp', at: '2025-05-06T16:00:00Z', pt: { title: 'Rockstar lança o Trailer 2 de Grand Theft Auto VI', excerpt: 'O segundo trailer mostra mais de Lucia, Jason e Vice City.', body: 'O segundo trailer mostra mais de Lucia, Jason e Vice City.' } },
  { slug: 'trailer-1', title: 'Rockstar releases Grand Theft Auto VI Trailer 1', excerpt: 'The first trailer confirms Vice City, the state of Leonida and Lucia.', source: 'Rockstar Games', image: 'art/cover.webp', at: '2023-12-05T00:00:00Z', pt: { title: 'Rockstar lança o Trailer 1 de Grand Theft Auto VI', excerpt: 'O primeiro trailer confirma Vice City, o estado de Leonida e Lucia.', body: 'O primeiro trailer confirma Vice City, o estado de Leonida e Lucia.' } },
];

// Region positions follow the drawn map outline; they are approximate.
const REGIONS: [slug: string, title: string, x: number, y: number][] = [
  ['vice-city', 'Vice City', 0.84, 0.66], ['leonida-keys', 'Leonida Keys', 0.62, 0.84], ['grassrivers', 'Grassrivers', 0.66, 0.63],
  ['port-gellhorn', 'Port Gellhorn', 0.13, 0.19], ['ambrosia', 'Ambrosia', 0.52, 0.3], ['mount-kalaga', 'Mount Kalaga', 0.32, 0.18],
];
const MODS: [string, string][] = [['engine', 'Engine'], ['brakes', 'Brakes'], ['transmission', 'Transmission'], ['suspension', 'Suspension'], ['armor', 'Armor'], ['turbo', 'Turbo'], ['livery', 'Livery'], ['wheels', 'Wheels']];
const VEHICLES: [game: string, slug: string, name: string, cls: string, img: string | null, seats: number | null][] = [
  ['gta-6', 'grotti-cheetah', 'Grotti Cheetah', 'Sports', 'editions/ultimate/grotti-cheetah-01.webp', 2],
  ['gta-6', 'vapid-stanier', 'Vapid Stanier', 'Sedan', 'editions/vintage/pack-vapid-stanier-01.webp', 4],
  ['gta-6', 'vapid-buggy', 'Vapid Buggy', 'Off-road', 'editions/ultimate/vapid-buggy-01.webp', 2],
  ['gta-6', 'one-eyed-willie', 'One-Eyed Willie', 'Off-road', 'editions/ultimate/one-eyed-willie-01.webp', null],
  ['gta-6', 'squalo', 'Squalo', 'Boat', 'editions/ultimate/squalo-01.webp', null],
  ['gta-online', 'cheetah-classic', 'Grotti Cheetah Classic', 'Sports classic', null, 2],
  ['gta-5', 'infernus', 'Pegassi Infernus', 'Super', null, 2],
  ['gta-5', 'zentorno', 'Pegassi Zentorno', 'Super', null, 2],
  ['gta-5', 'adder', 'Truffade Adder', 'Super', null, 2],
  ['gta-5', 'obey-9f', 'Obey 9F', 'Sports', 'games/gta-5/obey-9f.webp', 2],
  ['gta-5', 'buzzard', 'Nagasaki Buzzard', 'Helicopter', 'games/gta-5/buzzard.webp', 4],
];

export async function seedFacts() {
  const gameId: Record<string, number> = {};
  for (const [i, g] of GAMES.entries()) {
    const values = { slug: g.slug, name: g.name, shortName: g.short, year: g.year, universe: g.universe, setting: g.setting, leads: g.leads, facts: g.facts ?? [], summary: g.summary, image: g.image, gallery: g.gallery ?? [], releaseAt: g.releaseAt, sortOrder: i, i18n: g.pt ? { pt: g.pt } : {} };
    const [row] = await db.insert(games).values(values).onConflictDoUpdate({ target: games.slug, set: values }).returning({ id: games.id });
    gameId[g.slug] = row!.id;
  }
  for (const p of PAGES) {
    const shared = { title: p.title, summary: p.summary, status: p.status ?? null, source: p.source ?? null, image: p.image ?? null, video: p.video ?? null, infobox: p.infobox ?? [], gallery: p.gallery ?? [], i18n: p.pt ? { pt: { title: p.pt.title, summary: p.pt.summary, infobox: p.pt.infobox, source: p.pt.source } } : {} };
    const [page] = await db
      .insert(pages)
      .values({ ...shared, gameId: gameId[p.game]!, section: p.section, slug: p.slug })
      .onConflictDoUpdate({ target: [pages.gameId, pages.section, pages.slug], set: shared })
      .returning({ id: pages.id, current: pages.currentRevisionId, currentPt: pages.currentRevisionPt });
    const seedRevision = (locale: 'en' | 'pt', body: string) => db.insert(revisions).values({ pageId: page!.id, body, summary: 'Page created', sourceKind: p.status ? 'official' : 'none', source: p.source, state: 'accepted', sizeDelta: body.length, closedAt: new Date(), locale }).returning({ id: revisions.id });
    if (!page!.current) {
      const [rev] = await seedRevision('en', p.body);
      await db.update(pages).set({ currentRevisionId: rev!.id }).where(eq(pages.id, page!.id));
    } else {
      // Nobody but the seed has edited a page while its only revision is the first one.
      const count = await db.$count(revisions, and(eq(revisions.pageId, page!.id), eq(revisions.locale, 'en')));
      if (count === 1) await db.update(revisions).set({ body: p.body }).where(eq(revisions.id, page!.current));
    }
    if (p.pt && !page!.currentPt) {
      const [rev] = await seedRevision('pt', p.pt.body);
      await db.update(pages).set({ currentRevisionPt: rev!.id }).where(eq(pages.id, page!.id));
    }
  }
  for (const [i, [slug, name, description, pt]] of CHANNELS.entries()) {
    const set = { name, description, sortOrder: i, i18n: { pt } };
    await db.insert(channels).values({ slug, ...set }).onConflictDoUpdate({ target: channels.slug, set });
  }
  await db.insert(tags).values(TAGS.map(slug => ({ slug }))).onConflictDoNothing();
  for (const n of NEWS) {
    const values = { slug: n.slug, gameId: gameId['gta-6'], title: n.title, excerpt: n.excerpt, body: n.excerpt, status: 'official' as const, source: n.source, image: n.image, publishedAt: new Date(n.at), i18n: { pt: n.pt } };
    await db.insert(news).values(values).onConflictDoUpdate({ target: news.slug, set: values });
  }
  await db.insert(modCategories).values(MODS.map(([slug, name], sortOrder) => ({ slug, name, sortOrder }))).onConflictDoNothing();

  const keep = VEHICLES.map(v => v[1]);
  const stale = (await db.select({ id: vehicles.id, slug: vehicles.slug }).from(vehicles)).filter(v => !keep.includes(v.slug));
  for (const v of stale) if (!(await db.$count(builds, eq(builds.vehicleId, v.id)))) await db.delete(vehicles).where(eq(vehicles.id, v.id));
  for (const [game, slug, name, cls, image, seats] of VEHICLES) {
    const page = await db.query.pages.findFirst({ where: and(eq(pages.gameId, gameId[game]!), eq(pages.slug, slug), eq(pages.section, 'vehicles')) });
    const set = { name, class: cls, image, seats, pageId: page?.id };
    await db.insert(vehicles).values({ gameId: gameId[game]!, slug, ...set }).onConflictDoUpdate({ target: [vehicles.gameId, vehicles.slug], set });
  }

  const gta6 = gameId['gta-6']!;
  for (const [slug, title, x, y] of REGIONS) {
    const page = await db.query.pages.findFirst({ where: and(eq(pages.gameId, gta6), eq(pages.slug, slug), eq(pages.section, 'locations')) });
    const values = { description: page?.summary, image: page?.gallery[0] ?? page?.image, pageId: page?.id };
    const existing = await db.query.mapMarkers.findFirst({ where: and(eq(mapMarkers.gameId, gta6), eq(mapMarkers.title, title), eq(mapMarkers.layer, 'trailer')) });
    if (existing) await db.update(mapMarkers).set(values).where(eq(mapMarkers.id, existing.id));
    else await db.insert(mapMarkers).values({ ...values, gameId: gta6, layer: 'trailer', title, x, y, status: 'official', source: 'Rockstar Games website' });
  }

  const ids = videosData.map(v => v.youtubeId);
  await db.delete(videos).where(notInArray(videos.youtubeId, ids));
  await db
    .insert(videos)
    .values(videosData.map((v, position) => ({ youtubeId: v.youtubeId, title: v.title, gameId: v.game ? gameId[v.game] : null, kind: v.kind, position })))
    .onConflictDoUpdate({ target: videos.youtubeId, set: { title: dsql`excluded.title`, gameId: dsql`excluded.game_id`, kind: dsql`excluded.kind`, position: dsql`excluded.position` } });
  return gameId;
}

if (process.argv[1]?.endsWith('seed.ts')) {
  await seedFacts();
  const [{ n } = { n: 0 }] = await db.select({ n: dsql<number>`count(*)::int` }).from(pages);
  console.log(`seeded facts: ${n} pages`);
  await sql.end();
}
