'use client';

import { useT } from '@/i18n/t';
import { Link } from '@/i18n/navigation';
import { usePathname } from '@/i18n/navigation';
import { NAV, activeNav } from '@/lib/nav';

export function NavLinks() {
  const t = useT();
  const current = activeNav(usePathname());
  return (
    <nav aria-label={t('Main')} className="flex shrink-0 items-center gap-4 xl:gap-6">
      {NAV.map(item => {
        const on = item.label === current;
        return (
          <Link key={item.label} href={item.href} aria-current={on ? 'page' : undefined} className={`border-b-2 py-1.5 text-[15px] whitespace-nowrap ${on ? 'border-accent font-semibold text-text' : 'border-transparent text-muted hover:text-text'}`}>
            {t(item.label)}
          </Link>
        );
      })}
    </nav>
  );
}
