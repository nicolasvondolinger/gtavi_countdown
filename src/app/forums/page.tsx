import type { Metadata } from 'next';
import { ForumView } from '@/components/forum/ForumView';

export const metadata: Metadata = { title: 'Forums', description: 'Talk about every Grand Theft Auto game.' };

export default async function ForumsPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  return <ForumView channelSlug="gta-vi-speculation" params={await searchParams} />;
}
