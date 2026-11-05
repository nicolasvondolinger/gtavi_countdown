import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NewThreadForm } from '@/components/forum/NewThreadForm';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Container } from '@/components/ui/Container';
import { requireViewer } from '@/server/auth/session';
import { getChannels, getTags } from '@/server/forum/queries';

export const metadata: Metadata = { title: 'New thread', robots: { index: false } };

export default async function NewThreadPage({ params }: { params: Promise<{ channel: string }> }) {
  const slug = (await params).channel;
  const channel = (await getChannels()).find(c => c.slug === slug);
  if (!channel) notFound();
  await requireViewer(`/forums/${slug}/new`);
  const tags = await getTags();
  return (
    <Container className="mt-6 mb-16 flex max-w-[760px]! flex-col gap-4 lg:mt-8">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Forums', href: '/forums' }, { label: channel.name, href: `/forums/${slug}` }, { label: 'New thread' }]} />
      <h1 className="text-[41px]">New thread</h1>
      <NewThreadForm channelId={channel.id} channelSlug={channel.slug} tags={tags.map(t => t.slug)} />
    </Container>
  );
}
