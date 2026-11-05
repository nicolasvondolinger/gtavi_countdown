import type { Verification } from '@/components/ui/Status';

// The table on the home page. Keep a source on every row.
export const CONFIRMED: { topic: string; text: string; source: string; status: Verification }[] = [
  { topic: 'Release', text: '19 November 2026, PS5 and Xbox Series X|S. No PC date announced.', source: 'Rockstar Games', status: 'official' },
  { topic: 'Setting', text: 'The state of Leonida, including Vice City, Leonida Keys, Grassrivers, Port Gellhorn, Ambrosia and Mount Kalaga.', source: 'Official site, Trailer 2', status: 'official' },
  { topic: 'Protagonists', text: 'Lucia Caminos and Jason Duval.', source: 'Trailer 1, 5 Dec 2023', status: 'official' },
  { topic: 'Map size', text: 'Larger than Los Santos and Blaine County combined.', source: 'Forum grid overlay', status: 'leak' },
];
