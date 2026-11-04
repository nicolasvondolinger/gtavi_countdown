'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';
import type { IconName } from '@/components/ui/icon-paths';

const TABS: { label: string; href: string; icon: IconName; match: (p: string) => boolean }[] = [
  { label: 'Home', href: '/', icon: 'home', match: p => p === '/' },
  { label: 'Search', href: '/search', icon: 'search', match: p => p.startsWith('/search') },
  { label: 'Forums', href: '/forums', icon: 'forum', match: p => p.startsWith('/forums') },
  { label: 'Profile', href: '/me', icon: 'person', match: p => p.startsWith('/u/') || p === '/me' },
];

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Quick navigation" className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t border-line bg-bg pb-[env(safe-area-inset-bottom)] lg:hidden">
      {TABS.map(t => {
        const on = t.match(pathname);
        return (
          <Link key={t.label} href={t.href} aria-current={on ? 'page' : undefined} className={`flex flex-col items-center gap-0.5 border-t-2 py-1.5 text-xs ${on ? 'border-accent font-semibold text-text' : 'border-transparent text-muted'}`}>
            <Icon name={t.icon} size={24} />
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
