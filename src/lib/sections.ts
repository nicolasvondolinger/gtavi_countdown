export const SECTIONS = ['characters', 'vehicles', 'weapons', 'missions', 'locations', 'guides', 'lore'] as const;
export type Section = (typeof SECTIONS)[number];

export const SECTION_LABEL: Record<Section, string> = {
  characters: 'Characters',
  vehicles: 'Vehicles',
  weapons: 'Weapons',
  missions: 'Missions',
  locations: 'Locations',
  guides: 'Guides',
  lore: 'Lore',
};

export const isSection = (s: string): s is Section => (SECTIONS as readonly string[]).includes(s);
