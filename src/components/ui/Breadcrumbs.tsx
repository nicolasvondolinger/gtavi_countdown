import Link from 'next/link';
import { Fragment } from 'react';

export type Crumb = { label: string; href?: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? '';
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.label, ...(c.href ? { item: site + c.href } : {}) })),
  };
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-[13px]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }} />
      {items.map((c, i) => (
        <Fragment key={c.label + i}>
          {i > 0 && <span aria-hidden="true" className="text-dim">&gt;</span>}
          {c.href && i < items.length - 1 ? (
            <Link href={c.href} className="text-muted hover:text-text">
              {c.label}
            </Link>
          ) : (
            <span aria-current={i === items.length - 1 ? 'page' : undefined} className={i === items.length - 1 ? 'text-text' : 'text-muted'}>
              {c.label}
            </span>
          )}
        </Fragment>
      ))}
    </nav>
  );
}
