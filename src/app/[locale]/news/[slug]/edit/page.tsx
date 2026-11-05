import { localizedMeta } from '@/i18n/page';
import { getT } from '@/i18n/server';
import { eq } from 'drizzle-orm';
import { notFound, redirect } from 'next/navigation';
import { StoryForm } from '@/components/news/StoryForm';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Container } from '@/components/ui/Container';
import { requireViewer } from '@/server/auth/session';
import { db, schema } from '@/server/db';
import { getGames } from '@/server/wiki/queries';

export const generateMetadata = localizedMeta({ title: 'Edit story', robots: { index: false } });

export default async function EditStoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const t = await getT();
  const slug = (await params).slug;
  const viewer = await requireViewer(`/news/${slug}/edit`);
  if (viewer.profile.role !== 'moderator') redirect('/news');
  const [story] = await db.select().from(schema.news).where(eq(schema.news.slug, slug)).limit(1);
  if (!story) notFound();
  const games = (await getGames('en')).map(g => ({ id: g.id, name: g.shortName }));
  return (
    <Container className="mt-6 mb-16 flex max-w-[760px]! flex-col gap-4 lg:mt-8">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'News', href: '/news' }, { label: story.title, href: `/news/${slug}` }, { label: 'Edit' }]} />
      <h1 className="text-[41px]">{t('Edit story')}</h1>
      <StoryForm games={games} story={story} />
    </Container>
  );
}
