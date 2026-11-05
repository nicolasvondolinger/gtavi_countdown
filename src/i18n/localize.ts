// Picks the Portuguese version of a database row when it has one.
type Localized<P> = { i18n?: { pt?: Partial<P> } | null };

export function localize<R extends Localized<P>, P extends object>(row: R, locale: string): R {
  const pt = row.i18n?.pt;
  return locale === 'pt' && pt ? { ...row, ...Object.fromEntries(Object.entries(pt).filter(([, v]) => v !== undefined && v !== null && v !== '')) } : row;
}
