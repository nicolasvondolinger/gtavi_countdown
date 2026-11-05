import { beforeAll, describe, expect, it } from 'vitest';
import { seedFacts } from '@/server/db/seed';
import { search, suggest } from '@/server/search/queries';

beforeAll(seedFacts);

describe('search', () => {
  it('suggests pages from any game, naming the game', async () => {
    const lucia = await suggest('lucia');
    expect(lucia[0]).toMatchObject({ title: 'Lucia Caminos', game: 'GTA VI', category: 'Character', href: '/gta-6/characters/lucia' });
    const michael = await suggest('michael');
    expect(michael[0]).toMatchObject({ title: 'Michael De Santa', game: 'GTA V' });
  });

  it('tolerates typos', async () => {
    expect((await suggest('micheal'))[0]?.title).toBe('Michael De Santa');
  });

  it('ignores terms that are too short', async () => {
    expect(await suggest('a')).toEqual([]);
  });

  it('filters by game', async () => {
    const all = await search('los santos');
    expect(new Set(all.results.filter(r => r.kind === 'pages').map(r => r.label.split(' · ')[0])).size).toBeGreaterThan(1);
    const v = await search('los santos', { game: 'gta-5' });
    expect(v.results.every(r => r.label.startsWith('GTA V'))).toBe(true);
  });

  it('filters by verification status', async () => {
    const { results } = await search('lucia', { status: 'official' });
    expect(results.length).toBeGreaterThan(0);
    expect(results.every(r => r.status === 'official')).toBe(true);
  });
});
