'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, type ReactNode } from 'react';
import { Icon } from '@/components/ui/Icon';
import { NAV } from '@/lib/nav';
import { Wordmark } from './Wordmark';

const LINKS = [
  { label: 'All games', href: '/games' },
  { label: 'About', href: '/about' },
  { label: 'Privacy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
];

export function MobileBar({ account }: { account: ReactNode }) {
  const pathname = usePathname();
  // The menu belongs to the page it was opened on, so changing page closes it.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;

  return (
    <div className="lg:hidden">
      <div className="flex items-center gap-3.5 border-b border-line bg-bg px-4 py-2.5">
        <button type="button" onClick={() => setOpenOn(open ? null : pathname)} aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? 'Close menu' : 'Open menu'}>
          <Icon name={open ? 'close' : 'menu'} size={26} />
        </button>
        <div className="flex-1"><Wordmark size={19} /></div>
        <Link href="/search" aria-label="Search"><Icon name="search" size={24} /></Link>
        {account}
      </div>
      {open && (
        <nav id="mobile-menu" aria-label="Menu" className="absolute inset-x-0 z-40 min-h-[calc(100dvh-54px)] bg-bg px-4 pt-2 pb-24">
          {NAV.map(item => (
            <Link key={item.label} href={item.href} className="flex items-center justify-between border-b border-line py-3 text-[17px] font-semibold">
              {item.label}
              <Icon name="chevronRight" className="text-muted" />
            </Link>
          ))}
          <div className="mt-6">
            {LINKS.map(item => (
              <Link key={item.label} href={item.href} className="block border-t border-line py-2.5 text-base text-soft">{item.label}</Link>
            ))}
          </div>
        </nav>
      )}
    </div>
  );
}
