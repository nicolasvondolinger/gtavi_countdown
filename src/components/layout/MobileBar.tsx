'use client';

import { useT } from '@/i18n/t';
import { Link } from '@/i18n/navigation';
import { usePathname } from '@/i18n/navigation';
import { useState, type ReactNode } from 'react';
import { Icon } from '@/components/ui/Icon';
import { NAV } from '@/lib/nav';
import { DISCORD_URL } from '@/lib/site';
import { LocaleSwitch } from './LocaleSwitch';
import { ThemeToggle } from './ThemeToggle';
import { Wordmark } from './Wordmark';

const LINKS = [
  { label: 'All games', href: '/games' },
  { label: 'Trailers and videos', href: '/videos' },
  { label: 'Recent changes', href: '/changes' },
  { label: 'About', href: '/about' },
  { label: 'Wiki policies', href: '/policies' },
  { label: 'Privacy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
];

export function MobileBar({ account }: { account: ReactNode }) {
  const t = useT();
  const pathname = usePathname();
  // The menu belongs to the page it was opened on, so changing page closes it.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;

  return (
    <div className="lg:hidden">
      <div className="flex items-center gap-3.5 border-b border-line bg-bg px-4 py-2.5">
        <button type="button" onClick={() => setOpenOn(open ? null : pathname)} aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? t('Close menu') : t('Open menu')}>
          <Icon name={open ? 'close' : 'menu'} size={26} />
        </button>
        <div className="flex-1"><Wordmark size={19} /></div>
        <Link href="/search" aria-label={t('Search')}><Icon name="search" size={24} /></Link>
        {account}
      </div>
      {open && (
        <nav id="mobile-menu" aria-label={t('Menu')} className="absolute inset-x-0 z-40 min-h-[calc(100dvh-54px)] bg-bg px-4 pt-2 pb-24">
          {NAV.map(item => (
            <Link key={item.label} href={item.href} className="flex items-center justify-between border-b border-line py-3 text-[17px] font-semibold">
              {t(item.label)}
              <Icon name="chevronRight" className="text-muted" />
            </Link>
          ))}
          <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between border-b border-line py-3 text-[17px] font-semibold">
            {t('Join our Discord')}
            <Icon name="discord" className="text-muted" />
          </a>
          <div className="mt-6">
            {LINKS.map(item => (
              <Link key={item.label} href={item.href} className="block border-t border-line py-2.5 text-base text-soft">{t(item.label)}</Link>
            ))}
          </div>
          <div className="mt-6 flex items-center justify-between border-t border-line pt-4">
            <LocaleSwitch />
            <ThemeToggle withLabel />
          </div>
        </nav>
      )}
    </div>
  );
}
