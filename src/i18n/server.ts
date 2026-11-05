import { getLocale } from 'next-intl/server';
import type { T } from './t';
import { translate } from './translate';

export async function getT(): Promise<T> {
  const locale = await getLocale();
  return (text, vars) => translate(locale, text, vars);
}
