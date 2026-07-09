// Backwards-compatible re-export. The language state now lives in a shared
// React Context (see contexts/LanguageContext) so every component reads and
// updates the same language instead of holding isolated copies.
export { useLanguage } from '@/contexts/LanguageContext';
export type { SupportedLanguages } from '@/i18n/translations';
