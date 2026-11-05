import { describe, expect, it } from 'vitest';
import { bestIndex, parseVehicleKeys, statGains } from '@/lib/compare';

describe('bestIndex', () => {
  it('picks the highest or lowest', () => {
    expect(bestIndex([121, 108, 134], 'high')).toBe(2);
    expect(bestIndex([3.9, 5.2, 3.1], 'low')).toBe(2);
  });
  it('ignores unknown values', () => expect(bestIndex([null, 5, 7], 'high')).toBe(2));
  it('has no winner on a tie or a lone value', () => {
    expect(bestIndex([2, 4, 4], 'high')).toBe(-1);
    expect(bestIndex([null, 4], 'high')).toBe(-1);
  });
});

describe('parseVehicleKeys', () => {
  it('keeps valid unique keys, up to four', () => {
    expect(parseVehicleKeys('gta-5.adder,gta-5.adder,bad key,gta-6.a,gta-6.b,gta-6.c,gta-6.d')).toEqual(['gta-5.adder', 'gta-6.a', 'gta-6.b', 'gta-6.c']);
  });
});

it('adds up stat gains', () => {
  expect(statGains([{ deltas: { braking: 8 } }, { deltas: { braking: 2, armor: 5 } }, { deltas: {} }])).toEqual({ braking: 10, armor: 5 });
});
