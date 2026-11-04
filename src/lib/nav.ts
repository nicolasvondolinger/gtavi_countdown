export const NAV = [
  { label: 'Explore Wiki', href: '/games' },
  { label: 'Database', href: '/database/vehicles/compare' },
  { label: 'Forums', href: '/forums' },
  { label: 'News', href: '/news' },
  { label: 'Map', href: '/gta-6/map' },
] as const;

export type NavLabel = (typeof NAV)[number]['label'];

export function activeNav(pathname: string): NavLabel | null {
  if (pathname.startsWith('/database') || pathname.startsWith('/b/')) return 'Database';
  if (pathname.startsWith('/forums')) return 'Forums';
  if (pathname.startsWith('/news')) return 'News';
  if (pathname.endsWith('/map')) return 'Map';
  if (pathname === '/' || pathname.startsWith('/games') || pathname.startsWith('/gta') || pathname.startsWith('/search')) return 'Explore Wiki';
  return null;
}
