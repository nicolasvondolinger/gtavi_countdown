import { LegalPage } from '@/components/ui/LegalPage';
import { localizedMeta, pageLocale, type LocaleParams } from '@/i18n/page';
import { getT } from '@/i18n/server';

export const generateMetadata = localizedMeta({ title: 'Privacy Policy' });

export default async function PrivacyPage({ params }: LocaleParams) {
  await pageLocale(params);
  const t = await getT();
  return (
    <LegalPage title={t('Privacy Policy')}>
      <div className="prose-wiki">
        <p><strong>{t('Draft. This text needs legal review before launch.')}</strong></p>
        <h2>{t('What we store')}</h2>
        <p>{t('Your email address, username, avatar choice, the contributions you make, your votes and, if you sign in with Google, Apple or Discord, the account identifier that provider returns.')}</p>
        <h2>{t('Why')}</h2>
        <p>{t('To run your account, show your contributions and calculate reputation. Marketing email is sent only if you opt in, and you can opt out at any time.')}</p>
        <h2>{t('Cookies and browser storage')}</h2>
        <p>{t('A session cookie keeps you signed in and a language cookie remembers your language. Your theme choice stays in your browser. YouTube players load only after you press play.')}</p>
        <h2>{t('Your data')}</h2>
        <p>{t('Contact the site operator to request a copy or deletion of your data.')}</p>
      </div>
    </LegalPage>
  );
}
