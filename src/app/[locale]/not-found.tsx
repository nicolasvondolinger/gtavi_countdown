import { useT } from '@/i18n/t';
import { Link } from '@/i18n/navigation';
import { Container } from '@/components/ui/Container';

export default function NotFound() {
  const t = useT();
  return (
    <Container className="my-24 flex flex-col gap-4">
      <h1 className="text-[56px]">{t('Page not found')}</h1>
      <p className="font-read text-[17px] text-body">{t('This page does not exist yet.')}</p>
      <p><Link href="/games" className="font-semibold text-accent hover:underline">{t('Browse all games')}</Link></p>
    </Container>
  );
}
