import { localizedMeta } from '@/i18n/page';
import { getT } from '@/i18n/server';
import { redirect } from 'next/navigation';
import { StoryForm } from '@/components/news/StoryForm';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Container } from '@/components/ui/Container';
import { requireViewer } from '@/server/auth/session';
import { getGames } from '@/server/wiki/queries';

export const generateMetadata = localizedMeta({ title: 'New story', robots: { index: false } });

export default async function NewStoryPage() {
  const t = await getT();
  const viewer = await requireViewer('/news/new');
  if (viewer.profile.role !== 'moderator') redirect('/news');
  const games = (await getGames('en')).map(g => ({ id: g.id, name: g.shortName }));
  return (
    <Container className="mt-6 mb-16 flex max-w-[760px]! flex-col gap-4 lg:mt-8">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'News', href: '/news' }, { label: 'New story' }]} />
      <h1 className="text-[41px]">{t('New story')}</h1>
      <StoryForm games={games} />
    </Container>
  );
}
