import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Container } from '@/components/ui/Container';
import { Tag } from '@/components/ui/Tag';
import { VideoCard } from '@/components/video/VideoCard';
import { localizedMeta } from '@/i18n/page';
import { getT } from '@/i18n/server';
import { getVideoCounts, getVideos } from '@/server/wiki/queries';

export const generateMetadata = localizedMeta({ title: 'Trailers and videos', description: 'Every Grand Theft Auto trailer and video from the official Rockstar Games channel.' });

export default async function VideosPage({ searchParams }: { searchParams: Promise<{ game?: string; kind?: string }> }) {
  const t = await getT();
  const { game, kind } = await searchParams;
  const onlyTrailers = kind === 'trailer';
  const [videos, counts] = await Promise.all([getVideos({ gameSlug: game, kind: onlyTrailers ? 'trailer' : undefined }), getVideoCounts()]);
  const href = (next: { game?: string; kind?: string }) => {
    const query = new URLSearchParams(Object.entries(next).filter((e): e is [string, string] => !!e[1])).toString();
    return query ? `/videos?${query}` : '/videos';
  };
  return (
    <Container className="mt-6 mb-16 flex flex-col gap-5 lg:mt-8 lg:mb-20">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Videos' }]} />
      <div className="flex flex-col gap-2">
        <h1 className="text-[41px] lg:text-[56px]">{t('Trailers and videos')}</h1>
        <p className="font-read text-[15px]/[1.6] text-body lg:text-[17px]">{t('Everything here comes from the official Rockstar Games channel. Titles stay as Rockstar published them.')}</p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Tag href={href({ kind })} active={!game}>{t('All games')}</Tag>
        {counts.map(c => <Tag key={c.slug} href={href({ game: c.slug, kind })} active={c.slug === game}>{c.name} ({c.count})</Tag>)}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Tag href={href({ game })} active={!onlyTrailers}>{t('Everything')}</Tag>
        <Tag href={href({ game, kind: 'trailer' })} active={onlyTrailers}>{t('Trailers only')}</Tag>
      </div>
      {videos.length === 0 && <p className="font-read text-[15px] text-muted">{t('No videos match these filters.')}</p>}
      <ul className="grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {videos.map(v => <li key={v.youtubeId}><VideoCard video={v} sizes="(min-width: 1280px) 22vw, (min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw" /></li>)}
      </ul>
    </Container>
  );
}
