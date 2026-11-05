import { localizedMeta } from '@/i18n/page';
import { ForumView } from '@/components/forum/ForumView';

export const generateMetadata = localizedMeta({ title: 'Forums', description: 'Talk about every Grand Theft Auto game.' });

export default async function ForumsPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  return <ForumView channelSlug="gta-vi-speculation" params={await searchParams} />;
}
