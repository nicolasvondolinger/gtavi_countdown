import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ForumView } from '@/components/forum/ForumView';
import { getChannels } from '@/server/forum/queries';

type Props = { params: Promise<{ channel: string }>; searchParams: Promise<Record<string, string | undefined>> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = (await params).channel;
  const channel = (await getChannels()).find(c => c.slug === slug);
  return channel ? { title: channel.name, description: channel.description } : {};
}

export default async function ChannelPage({ params, searchParams }: Props) {
  const view = await ForumView({ channelSlug: (await params).channel, params: await searchParams });
  if (!view) notFound();
  return view;
}
