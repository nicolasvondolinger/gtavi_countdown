import { readFileSync, readdirSync } from 'node:fs';
import { join, sep } from 'node:path';
import { describe, expect, it } from 'vitest';
import { localize } from '@/i18n/localize';
import { PT } from '@/i18n/pt';
import { translate } from '@/i18n/translate';
import { timeAgo } from '@/lib/format';

const source = (dir: string): string[] => readdirSync(dir, { withFileTypes: true }).flatMap(e => (e.isDirectory() ? source(join(dir, e.name)) : /\.tsx?$/.test(e.name) && e.name !== 'pt.ts' ? [join(dir, e.name)] : []));
const files = source('src').filter(f => !f.includes(`${sep}db${sep}`) && !f.includes(`${sep}content${sep}`)).map(f => readFileSync(f, 'utf8'));
const placeholders = (s: string) => (s.match(/\{\w+\}/g) ?? []).sort();

// English text used as a key: literal calls, and the label constants that translate where they render.
const keys = new Set(
  files.flatMap(text => [
    ...[...text.matchAll(/\b(?:t|tr|\(await getT\(\)\))\((['`])((?:\\.|(?!\1).)+)\1[,)]/g)].map(m => m[2]!),
    ...[...text.matchAll(/\? t\('([^']+)'\) :/g)].map(m => m[1]!),
    ...[...text.matchAll(/\{ label: '([^']+)'[,}]? ?(?:href|value|group|icon)?/g)].map(m => m[1]!),
  ]),
);

describe('Portuguese dictionary', () => {
  it('has every key used in the source', () => {
    const missing = [...keys].map(k => k.replace(/\\'/g, "'").replace(/\\n/g, '\n')).filter(k => !k.includes('${') && /[a-z]{2}/i.test(k) && !(k in PT));
    expect(missing).toEqual([]);
  });

  it('keeps the same placeholders as the English text', () => {
    const broken = Object.entries(PT).filter(([en, pt]) => placeholders(en).join() !== placeholders(pt).join());
    expect(broken).toEqual([]);
  });
});

describe('translate', () => {
  it('falls back to the English text', () => {
    expect(translate('pt', 'A sentence nobody translated')).toBe('A sentence nobody translated');
  });

  it('fills variables in either language', () => {
    expect(translate('en', 'Open the {place} map', { place: 'Leonida' })).toBe('Open the Leonida map');
    expect(translate('pt', 'Open the {place} map', { place: 'Leonida' })).toBe('Abrir o mapa de Leonida');
  });
});

describe('localize', () => {
  const row = { title: 'Weapons', summary: 'English', i18n: { pt: { title: 'Armas', summary: '' } } };

  it('overlays the Portuguese fields it has', () => {
    expect(localize(row, 'pt')).toMatchObject({ title: 'Armas', summary: 'English' });
  });

  it('leaves English alone', () => {
    expect(localize(row, 'en').title).toBe('Weapons');
  });
});

describe('timeAgo', () => {
  it('follows the language', () => {
    const now = Date.UTC(2026, 10, 5);
    expect(timeAgo(new Date(now - 2 * 864e5), now, 'en')).toBe('2 days ago');
    expect(timeAgo(new Date(now - 2 * 864e5), now, 'pt')).toBe('anteontem');
  });
});
