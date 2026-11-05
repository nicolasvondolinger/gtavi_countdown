import { revalidatePath } from 'next/cache';
import { routing } from '@/i18n/routing';

// Each language is its own cached route.
export function revalidateLocales(path: string, type?: 'layout' | 'page') {
  for (const locale of routing.locales) revalidatePath(`/${locale}${path === '/' ? '' : path}`, type);
}
