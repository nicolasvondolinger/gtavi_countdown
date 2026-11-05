import { describe, expect, it } from 'vitest';
import { USERNAME, levelFor, repForLevel, safeNext } from '@/lib/account';

describe('safeNext', () => {
  it('keeps same-site paths', () => expect(safeNext('/gta-6/map')).toBe('/gta-6/map'));
  it.each(['https://evil.example', '//evil.example', '/\\evil.example', null, ''])('rejects %s', v => expect(safeNext(v)).toBe('/'));
});

describe('usernames', () => {
  it('allows letters, numbers and underscores', () => expect(USERNAME.test('Vice_Runner7')).toBe(true));
  it.each(['ab', 'has space', 'a'.repeat(21), 'bad<tag>'])('rejects %s', v => expect(USERNAME.test(v)).toBe(false));
});

describe('levels', () => {
  it('rises with rep and never drops below 1', () => {
    expect(levelFor(-50)).toBe(1);
    expect(levelFor(0)).toBe(1);
    expect(levelFor(6120)).toBeGreaterThan(levelFor(4820));
  });
  it('agrees with the rep needed for each level', () => {
    for (const level of [2, 10, 31]) expect(levelFor(repForLevel(level))).toBe(level);
  });
});
