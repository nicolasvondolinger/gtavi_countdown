export type Direction = 'high' | 'low';

// Which column wins a row. Unknown values never win, and a tie has no winner.
export function bestIndex(values: (number | null)[], direction: Direction) {
  const known = values.filter((v): v is number => v !== null);
  if (known.length < 2) return -1;
  const target = direction === 'high' ? Math.max(...known) : Math.min(...known);
  return known.filter(v => v === target).length > 1 ? -1 : values.indexOf(target);
}

export const vehicleKey = (gameSlug: string, slug: string) => `${gameSlug}.${slug}`;

export function parseVehicleKeys(raw: string | undefined, max = 4) {
  return [...new Set((raw ?? '').split(',').map(k => k.trim()).filter(k => /^[a-z0-9-]+\.[a-z0-9-]+$/.test(k)))].slice(0, max);
}

export const BASE_STATS: Record<string, number> = { acceleration: 54, topSpeed: 70, braking: 48, handling: 60, armor: 20 };
export const STAT_LABEL: Record<string, string> = { acceleration: 'Acceleration', topSpeed: 'Top speed', braking: 'Braking', handling: 'Handling', armor: 'Armor' };

export function statGains(options: { deltas: Record<string, number> }[]) {
  const gains: Record<string, number> = {};
  for (const option of options) for (const [stat, value] of Object.entries(option.deltas)) gains[stat] = (gains[stat] ?? 0) + value;
  return gains;
}
