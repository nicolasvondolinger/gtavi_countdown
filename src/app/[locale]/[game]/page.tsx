import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Gallery } from '@/components/article/Gallery';
import { AdSlot } from '@/components/ui/AdSlot';
import { ArtSlot } from '@/components/ui/ArtSlot';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { LinkButton, TextLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { VideoCard } from '@/components/video/VideoCard';
import { Link } from '@/i18n/navigation';
import { pageLocale } from '@/i18n/page';
import { getT } from '@/i18n/server';
import { translate } from '@/i18n/translate';
import { SECTIONS, SECTION_LABEL } from '@/lib/sections';
import { getThreadsAbout } from '@/server/forum/queries';
import { getGame, getGamePages, getVideos } from '@/server/wiki/queries';

export const revalidate = 300;
export function generateStaticParams() {
  return [];
}

type Props = { params: Promise<{ locale: string; game: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, game: slug } = await params;
  const game = await getGame(slug, locale);
  return game ? { title: game.name, description: game.summary ?? translate(locale, '{game} characters, vehicles, missions, maps and guides.', { game: game.name }) } : {};
}

export default async function GameHub({ params }: Props) {
  const locale = await pageLocale(params);
  const t = await getT();
  const game = await getGame((await params).game, locale);
  if (!game) notFound();
  const [pages, threads, videos] = await Promise.all([getGamePages(game.id, locale), getThreadsAbout([game.shortName, game.name]), getVideos({ gameSlug: game.slug, limit: 3 })]);
  const topics = SECTIONS.map(section => ({ section, items: pages.filter(p => p.section === section).slice(0, 4) })).filter(topic => topic.items.length > 0);

  return (
    <>
      <Container className="mt-5 grid gap-6 lg:mt-7 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:gap-8">
        <div className="flex flex-col gap-3.5">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Games', href: '/games' }, { label: game.shortName }]} />
          {game.image ? (
            <div className="relative aspect-video overflow-hidden rounded-image">
              <Image src={`/media/${game.image}`} alt={t('{game} key art', { game: game.name })} fill priority sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover" />
            </div>
          ) : (
            <ArtSlot label={t('official {game} key art', { game: game.shortName })} className="aspect-[2/1]" />
          )}
        </div>
        <div className="flex flex-col gap-3.5 lg:pt-7">
          <h1 className="text-[41px] lg:text-[56px]">{game.name}</h1>
          {game.summary && <p className="font-read text-base/[1.6] text-body lg:text-[17px]">{game.summary}</p>}
          <dl>
            {(game.facts.length ? game.facts : [{ label: t('Year'), value: String(game.year) }, { label: t('Setting'), value: game.setting }, { label: t('Leads'), value: game.leads }]).map(f => (
              <div key={f.label} className="flex gap-3 border-t border-line py-2">
                <dt className="w-[100px] shrink-0 text-sm text-muted">{f.label}</dt>
                <dd className="text-sm font-semibold">{f.value}</dd>
              </div>
            ))}
          </dl>
          <LinkButton href={`/${game.slug}/map`} className="py-3">{t('Open the {place} map', { place: game.setting.split(',')[0] ?? game.setting })}</LinkButton>
        </div>
      </Container>
      <Container className="mt-10 mb-16 grid gap-10 lg:mt-14 lg:mb-20 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:gap-8">
        <div className="flex min-w-0 flex-col gap-10">
          <section aria-label={t('Browse {game}', { game: game.shortName })}>
            <h2 className="mb-5 text-[26px] lg:text-[33px]">{t('Browse {game}', { game: game.shortName })}</h2>
            {topics.length === 0 ? (
              <p className="font-read text-[15px] text-muted">{t('No pages yet. This game is waiting for its first editor.')}</p>
            ) : (
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {topics.map(({ section, items }) => (
                  <div key={section}>
                    <div className="flex items-center justify-between pb-2">
                      <h3 className="font-ui text-[17px] font-semibold">{t(SECTION_LABEL[section])}</h3>
                      <TextLink href={`/${game.slug}/${section}`} className="text-sm" aria-label={t('All {section}', { section: t(SECTION_LABEL[section]) })}>{t('All')}</TextLink>
                    </div>
                    <ul>
                      {items.map(p => (
                        <li key={p.slug} className="border-t border-line py-2">
                          <Link href={`/${game.slug}/${section}/${p.slug}`} className="text-[15px] text-body hover:text-accent">{p.title}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </section>
          {videos.length > 0 && (
            <section aria-label={t('Videos')}>
              <div className="mb-4 flex items-baseline justify-between gap-4">
                <h2 className="text-[26px] lg:text-[33px]">{t('Videos')}</h2>
                <TextLink href={`/videos?game=${game.slug}`}>{t('All videos')}</TextLink>
              </div>
              <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {videos.map(v => <li key={v.youtubeId}><VideoCard video={v} sizes="(min-width: 1024px) 20vw, 100vw" /></li>)}
              </ul>
            </section>
          )}
          <Gallery images={game.gallery} title={game.name} />
        </div>
        <aside className="flex flex-col gap-7">
          <section aria-label={t('{game} in the forums', { game: game.shortName })}>
            <h2 className="mb-2.5 text-[26px]">{t('{game} in the forums', { game: game.shortName })}</h2>
            {threads.map(thread => (
              <div key={thread.slug} className="border-t border-line py-2.5">
                <Link href={`/forums/${thread.channel}/${thread.slug}`} className="text-[15px] font-semibold hover:text-accent">{thread.title}</Link>
              </div>
            ))}
            <div className="border-t border-line pt-2.5"><TextLink href={threads[0] ? `/forums/${threads[0].channel}` : '/forums/general'}>{threads.length ? t('More in the forums') : t('Start the conversation')}</TextLink></div>
          </section>
          <AdSlot size="300x250" />
        </aside>
      </Container>
    </>
  );
}
