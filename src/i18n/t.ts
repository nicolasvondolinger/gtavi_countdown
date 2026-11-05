import { useLocale } from 'next-intl';
import { translate, type Vars } from './translate';

export type T = (text: string, vars?: Vars) => string;

export function useT(): T {
  const locale = useLocale();
  return (text, vars) => translate(locale, text, vars);
}
