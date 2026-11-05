import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { translate } from './translate';

export type LocaleParams = { params: Promise<{ locale: string }> };

// Cached pages name their language here, otherwise next-intl reads headers and the page turns dynamic.
export async function pageLocale(params: Promise<{ locale: string }>) {
  const { locale } = await params;
  setRequestLocale(locale);
  return locale;
}

export function localizedMeta({ title, description, ...rest }: Omit<Metadata, 'title' | 'description'> & { title: string; description?: string }) {
  return async ({ params }: LocaleParams): Promise<Metadata> => {
    const { locale } = await params;
    return { ...rest, title: translate(locale, title), ...(description ? { description: translate(locale, description) } : {}) };
  };
}
