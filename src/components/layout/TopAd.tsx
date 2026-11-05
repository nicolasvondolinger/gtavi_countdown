'use client';

import { usePathname } from 'next/navigation';
import { AdStrip } from '@/components/ui/AdSlot';

// The leaderboard sits above the header on reading pages. Tools and account pages stay clear.
export function TopAd() {
  const path = usePathname();
  const hidden = /^\/(forums|search|signin|signup|onboarding|database|b|u|me)(\/|$)/.test(path) || path.endsWith('/map') || path.endsWith('/edit') || path.endsWith('/history');
  if (hidden) return null;
  const article = path.split('/').length >= 4;
  return <AdStrip size={article ? '728x90' : '970x90'} />;
}
