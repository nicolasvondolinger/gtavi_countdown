import { defineRouting } from 'next-intl/routing';

// English has no prefix; Portuguese lives under /pt. Each language is a real URL,
// so pages stay cacheable and search engines can index both.
export const routing = defineRouting({ locales: ['en', 'pt'], defaultLocale: 'en', localePrefix: 'as-needed', localeCookie: { maxAge: 60 * 60 * 24 * 365 } });

export type Locale = (typeof routing.locales)[number];
