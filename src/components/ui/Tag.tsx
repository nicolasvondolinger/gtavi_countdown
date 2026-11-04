import Link from 'next/link';
import type { ReactNode } from 'react';

const base = 'inline-block rounded-image px-2 py-0.5 text-[13px] leading-5';

export function Tag({ children, href, active }: { children: ReactNode; href?: string; active?: boolean }) {
  const style = active ? `${base} border border-accent text-text` : `${base} bg-raised text-soft`;
  return href ? (
    <Link href={href} aria-current={active ? 'true' : undefined} className={`${style} hover:text-text`}>
      {children}
    </Link>
  ) : (
    <span className={style}>{children}</span>
  );
}
