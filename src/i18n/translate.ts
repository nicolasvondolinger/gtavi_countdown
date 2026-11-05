import { PT } from './pt';

export type Vars = Record<string, string | number>;

// The English text is the key, so a missing translation falls back to readable English.
export function translate(locale: string, text: string, vars?: Vars) {
  const value = locale === 'pt' ? (PT[text] ?? text) : text;
  return vars ? value.replace(/\{(\w+)\}/g, (_, k: string) => String(vars[k] ?? '')) : value;
}
