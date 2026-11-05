import { Markdown } from '@/components/article/Markdown';
import { LegalPage } from '@/components/ui/LegalPage';
import { POLICIES } from '@/content/policies';
import { localizedMeta, pageLocale, type LocaleParams } from '@/i18n/page';
import { getT } from '@/i18n/server';

export const generateMetadata = localizedMeta({ title: 'Wiki policies', description: 'How GTA Wiki is written and moderated: verification, sources, spoilers, copyright and conduct.' });

export default async function PoliciesPage({ params }: LocaleParams) {
  const locale = await pageLocale(params);
  const t = await getT();
  return (
    <LegalPage title={t('Wiki policies')}>
      <Markdown>{locale === 'pt' ? POLICIES.pt : POLICIES.en}</Markdown>
    </LegalPage>
  );
}
