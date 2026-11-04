import { describe, expect, it } from 'vitest';
import { activeNav } from '@/lib/nav';

describe('activeNav', () => {
  it.each([
    ['/', 'Explore Wiki'],
    ['/gta-5/vehicles/infernus', 'Explore Wiki'],
    ['/gta-6/map', 'Map'],
    ['/database/builds/new', 'Database'],
    ['/forums/modding', 'Forums'],
    ['/news', 'News'],
  ])('%s is %s', (path, label) => {
    expect(activeNav(path)).toBe(label);
  });
});
