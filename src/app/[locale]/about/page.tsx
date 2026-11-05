import { Markdown } from '@/components/article/Markdown';
import { LegalPage } from '@/components/ui/LegalPage';
import { ABOUT } from '@/content/about';
import { localizedMeta, pageLocale, type LocaleParams } from '@/i18n/page';
import { getT } from '@/i18n/server';

export const generateMetadata = localizedMeta({ title: 'About', description: 'GTA Wiki is an independent, fan-run wiki and forum for the Grand Theft Auto series.' });

export default async function AboutPage({ params }: LocaleParams) {
  const locale = await pageLocale(params);
  const t = await getT();
  return (
    <LegalPage title={t('About GTA Wiki')}>
      <Markdown>{locale === 'pt' ? ABOUT.pt : ABOUT.en}</Markdown>
    </LegalPage>
  );
}
