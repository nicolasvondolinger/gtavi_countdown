'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV, activeNav } from '@/lib/nav';

export function NavLinks() {
  const current = activeNav(usePathname());
  return (
    <nav aria-label="Main" className="flex items-center gap-6">
      {NAV.map(item => {
        const on = item.label === current;
        return (
          <Link key={item.label} href={item.href} aria-current={on ? 'page' : undefined} className={`border-b-2 py-1.5 text-[15px] ${on ? 'border-accent font-semibold text-text' : 'border-transparent text-muted hover:text-text'}`}>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
