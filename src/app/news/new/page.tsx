import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { StoryForm } from '@/components/news/StoryForm';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Container } from '@/components/ui/Container';
import { requireViewer } from '@/server/auth/session';
import { getGames } from '@/server/wiki/queries';

export const metadata: Metadata = { title: 'New story', robots: { index: false } };

export default async function NewStoryPage() {
  const viewer = await requireViewer('/news/new');
  if (viewer.profile.role !== 'moderator') redirect('/news');
  const games = (await getGames()).map(g => ({ id: g.id, name: g.shortName }));
  return (
    <Container className="mt-6 mb-16 flex max-w-[760px]! flex-col gap-4 lg:mt-8">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'News', href: '/news' }, { label: 'New story' }]} />
      <h1 className="text-[41px]">New story</h1>
      <StoryForm games={games} />
    </Container>
  );
}
