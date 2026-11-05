import { LegalPage } from '@/components/ui/LegalPage';
import { Link } from '@/i18n/navigation';
import { localizedMeta, pageLocale, type LocaleParams } from '@/i18n/page';
import { getT } from '@/i18n/server';

export const generateMetadata = localizedMeta({ title: 'Terms of Service' });

export default async function TermsPage({ params }: LocaleParams) {
  await pageLocale(params);
  const t = await getT();
  return (
    <LegalPage title={t('Terms of Service')}>
      <div className="prose-wiki">
        <p><strong>{t('Draft. This text needs legal review before launch.')}</strong></p>
        <h2>{t('Contributions')}</h2>
        <p>{t('You keep the rights to what you post and allow GTA Wiki to display and edit it as part of the wiki.')}</p>
        <h2>{t('Conduct')}</h2>
        <p>{t('Tag spoilers, cite sources, and do not post leaked game builds, piracy links or personal information about others.')}</p>
        <h2>{t('Moderation')}</h2>
        <p>{t('Edits can be reverted and accounts can be limited when they break these rules.')}</p>
        <p><Link href="/policies">{t('Wiki policies')}</Link></p>
      </div>
    </LegalPage>
  );
}
