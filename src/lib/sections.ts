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

// One sentence each, because word order changes by language.
export const SECTION_TITLE: Record<Section, string> = {
  characters: '{game} characters',
  vehicles: '{game} vehicles',
  weapons: '{game} weapons',
  missions: '{game} missions',
  locations: '{game} locations',
  guides: '{game} guides',
  lore: '{game} lore',
};

export const SECTION_SINGULAR: Record<Section, string> = {
  characters: 'Character',
  vehicles: 'Vehicle',
  weapons: 'Weapon',
  missions: 'Mission',
  locations: 'Location',
  guides: 'Guide',
  lore: 'Lore',
};

export const isSection = (s: string): s is Section => (SECTIONS as readonly string[]).includes(s);
