'use client';

import { useLocale } from 'next-intl';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import { routing, type Locale } from '@/i18n/routing';
import { useT } from '@/i18n/t';

const NAMES: Record<Locale, string> = { en: 'English', pt: 'Português' };

// Real links, so each language can be opened in a new tab. A click keeps the query string.
export function LocaleSwitch() {
  const t = useT();
  const current = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  return (
    <div role="group" aria-label={t('Language')} className="flex shrink-0 items-center gap-1.5 text-[13px]">
      {routing.locales.map((locale, i) => (
        <span key={locale} className="flex items-center gap-1.5">
          {i > 0 && <span aria-hidden="true" className="text-dim">/</span>}
          <Link
            href={pathname}
            locale={locale}
            hrefLang={locale}
            lang={locale}
            aria-label={NAMES[locale]}
            aria-current={locale === current ? 'true' : undefined}
            onClick={e => {
              e.preventDefault();
              router.replace(`${pathname}${window.location.search}`, { locale });
            }}
            className={locale === current ? 'font-semibold text-text uppercase' : 'text-muted uppercase hover:text-text'}
          >
            {locale}
          </Link>
        </span>
      ))}
    </div>
  );
}
