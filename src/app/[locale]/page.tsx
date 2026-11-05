import Image from 'next/image';
import { Countdown } from '@/components/home/Countdown';
import { HeroGallery } from '@/components/home/HeroGallery';
import { NewsRow } from '@/components/news/NewsRow';
import { AdSlot } from '@/components/ui/AdSlot';
import { LinkButton, TextLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Icon } from '@/components/ui/Icon';
import { Meta } from '@/components/ui/Meta';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Status } from '@/components/ui/Status';
import { Tag } from '@/components/ui/Tag';
import { TimeAgo } from '@/components/ui/TimeAgo';
import { VideoCard } from '@/components/video/VideoCard';
import { CONFIRMED } from '@/content/confirmed';
import { Link } from '@/i18n/navigation';
import { pageLocale, type LocaleParams } from '@/i18n/page';
import { getT } from '@/i18n/server';
import { compact } from '@/lib/format';
import { getGame, getGamePages, getHotThreads, getMostRead, getNews, getOtherGames, getVideos } from '@/server/wiki/queries';

export const revalidate = 60;

const SHELF = ['gta-5', 'gta-online', 'gta-4', 'gta-san-andreas', 'gta-vice-city', 'gta-3'];

export default async function Home({ params }: LocaleParams) {
  const locale = await pageLocale(params);
  const t = await getT();
  const game = await getGame('gta-6', locale);
  if (!game) throw new Error('Run the seed: game gta-6 is missing');
  const [shelf, cast, places, feed, mostRead, threads, trailers] = await Promise.all([
    getOtherGames(game.slug, SHELF, locale),
    getGamePages(game.id, locale, 'characters'),
    getGamePages(game.id, locale, 'locations'),
    getNews(locale, 8),
    getMostRead(locale),
    getHotThreads(locale),
    getVideos({ gameSlug: game.slug, limit: 3 }),
  ]);
  const lead = feed.find(n => n.status === 'official');
  const rest = feed.filter(n => n !== lead);

  return (
    <>
      <Container className="grid gap-6 pt-0 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:gap-8 lg:pt-8">
        <div className="-mx-4 sm:mx-0"><HeroGallery /></div>
        <section aria-labelledby="featured" className="flex flex-col gap-5">
          <h1 id="featured" className="text-[41px] lg:text-[56px]">{game.name}</h1>
          <p className="font-read text-base/[1.6] text-body lg:text-[17px]">{t('The next game in the series. Out on PS5 and Xbox Series X|S on 19 November 2026; digital preload opens on 12 November.')}</p>
          <Status kind="official" source={t('Rockstar Games')} />
          <hr className="border-line" />
          <Countdown target={game.releaseAt!.toISOString()} />
          <hr className="border-line" />
          <LinkButton href={`/${game.slug}/map`} className="py-3">{t('Open the Leonida map')}</LinkButton>
          <div className="flex flex-col gap-3">
            <TextLink href="#confirmed">{t('What Rockstar has confirmed so far')}</TextLink>
            <TextLink href={`/${game.slug}/guides/release-date-and-editions`}>{t('Release date and editions')}</TextLink>
            <TextLink href="/forums/gta-vi-speculation">{t('Launch-week thread in the forums')}</TextLink>
          </div>
        </section>
      </Container>

      <Container className="mt-14 lg:mt-16">
        <SectionTitle action={<TextLink href="/games">{t('All games')}</TextLink>}>{t('Explore by game')}</SectionTitle>
        <p className="mt-2 font-read text-[15px] text-muted">{t('Characters, vehicles, missions, maps and guides for all of them, from the 1997 original on.')}</p>
        <ul className="mt-3 grid grid-cols-1 lg:grid-cols-6 lg:gap-6">
          {shelf.map(g => (
            <li key={g.slug} className="border-t border-line py-3 lg:border-edge lg:pt-3.5">
              <Link href={`/${g.slug}`} className="group flex items-baseline justify-between gap-3 lg:flex-col lg:gap-1.5">
                <span>
                  <span className="block font-ui text-base font-semibold group-hover:text-accent lg:font-display lg:text-[26px] lg:leading-tight">{g.name}</span>
                  <span className="text-[13px] text-muted lg:text-sm lg:text-soft">{g.setting}</span>
                  <span className="hidden text-[13px] text-muted lg:block">{g.leads}</span>
                </span>
                <span className="font-data text-[13px] text-muted lg:order-first">{g.year}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>

      <section aria-label={t('GTA VI characters')} className="mt-14 lg:mt-[72px]">
        <Container><SectionTitle action={<TextLink href={`/${game.slug}/characters`}>{t('All {n}', { n: cast.length })}</TextLink>}>{t('GTA VI characters')}</SectionTitle></Container>
        <Container className="mt-4 lg:mt-5">
          <ul className="-mr-4 flex gap-3 overflow-x-auto pb-1 lg:mr-0 lg:gap-4 lg:overflow-visible">
            {cast.map(c => (
              <li key={c.slug} className="w-[108px] shrink-0 lg:w-auto lg:flex-1">
                <Link href={`/${game.slug}/characters/${c.slug}`} className="group flex flex-col gap-1.5 lg:gap-2">
                  <span className="relative aspect-[3/4] overflow-hidden rounded-image">
                    {c.image && <Image src={`/media/${c.image}`} alt="" fill sizes="(min-width: 1024px) 12vw, 108px" className="object-cover" />}
                  </span>
                  <span className="text-sm font-semibold group-hover:text-accent lg:text-[15px]">{c.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <Container className="mt-14 lg:mt-[72px]">
        <section aria-label={t('Explore Leonida')}>
          <SectionTitle action={<TextLink href={`/${game.slug}/locations`}>{t('All locations')}</TextLink>}>{t('Explore Leonida')}</SectionTitle>
          <ul className="mt-4 grid grid-cols-2 gap-3 lg:mt-5 lg:grid-cols-3 lg:gap-4">
            {places.map(p => (
              <li key={p.slug}>
                <Link href={`/${game.slug}/locations/${p.slug}`} className="group flex flex-col gap-2">
                  <span className="relative aspect-video overflow-hidden rounded-image">
                    {p.image && <Image src={`/media/${p.image}`} alt="" fill sizes="(min-width: 1024px) 30vw, 50vw" className="object-cover" />}
                  </span>
                  <span className="text-[15px] font-semibold group-hover:text-accent">{p.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </Container>

      <Container className="mt-14 lg:mt-[72px]">
        <section aria-label={t('Trailers')}>
          <SectionTitle action={<TextLink href="/videos">{t('All videos')}</TextLink>}>{t('Trailers')}</SectionTitle>
          <ul className="mt-4 grid gap-6 sm:grid-cols-2 lg:mt-5 lg:grid-cols-3">
            {trailers.map(v => <li key={v.youtubeId}><VideoCard video={v} /></li>)}
          </ul>
        </section>
      </Container>

      <Container className="mt-14 grid gap-10 lg:mt-[72px] lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:gap-8">
        <section aria-label={t('Series news')} className="flex flex-col gap-4">
          <SectionTitle action={<TextLink href="/news">{t('All news')}</TextLink>}>{t('Series news')}</SectionTitle>
          {lead && (
            <article className="grid gap-4 pb-2 sm:grid-cols-2 sm:gap-6">
              {lead.image && (
                <div className="relative aspect-video overflow-hidden rounded-image">
                  <Image src={`/media/${lead.image}`} alt="" fill sizes="(min-width: 1024px) 30vw, 100vw" className="object-cover" />
                </div>
              )}
              <div className="flex flex-col gap-2.5">
                <Meta>
                  {lead.game && <Tag>{lead.game}</Tag>}
                  {lead.status && <Status kind={lead.status} source={lead.source} />}
                </Meta>
                <h3 className="text-[26px] lg:text-[33px]"><Link href={`/news/${lead.slug}`} className="hover:text-accent">{lead.title}</Link></h3>
                <p className="font-read text-[15px]/[1.6] text-body">{lead.excerpt}</p>
                <p className="text-[13px] text-muted"><TimeAgo date={lead.publishedAt} /></p>
              </div>
            </article>
          )}
          <div>{rest.map(item => <NewsRow key={item.id} item={item} />)}</div>
        </section>

        <aside className="flex flex-col gap-10">
          <section aria-label={t('Most read across the series')}>
            <h2 className="mb-3 text-[26px]">{t('Most read across the series')}</h2>
            <ol>
              {mostRead.map((p, i) => (
                <li key={p.gameSlug + p.slug} className="flex gap-3.5 border-t border-line py-2.5">
                  <span className="w-[18px] font-data text-[15px] text-dim">{i + 1}</span>
                  <Link href={`/${p.gameSlug}/${p.section}/${p.slug}`} className="group flex flex-col gap-0.5">
                    <span className="text-[15px] font-semibold group-hover:text-accent">{p.title}</span>
                    <span className="text-[13px] text-muted">{p.game}</span>
                  </Link>
                </li>
              ))}
            </ol>
          </section>
          {threads.length > 0 && (
            <section aria-label={t('In the forums')}>
              <h2 className="mb-3 text-[26px]">{t('In the forums')}</h2>
              {threads.map(thread => (
                <div key={thread.slug} className="flex flex-col gap-1 border-t border-line py-2.5">
                  <Link href={`/forums/${thread.channelSlug}/${thread.slug}`} className="text-[15px] font-semibold hover:text-accent">{thread.title}</Link>
                  <div className="flex items-center gap-2.5 text-[13px] text-muted">
                    <span>{thread.channel}</span>
                    <span className="flex items-center gap-0.5 font-data text-xs"><Icon name="arrowUp" size={14} />{compact(thread.score)}</span>
                    <span className="flex items-center gap-1 font-data text-xs"><Icon name="comment" size={14} />{compact(thread.replyCount)}</span>
                  </div>
                </div>
              ))}
            </section>
          )}
          <AdSlot size="300x250" />
        </aside>
      </Container>

      <Container className="mt-14 mb-16 lg:mt-[72px] lg:mb-20">
        <section id="confirmed" aria-label={t('What Rockstar has confirmed about GTA VI')} className="scroll-mt-6">
          <SectionTitle>{t('What Rockstar has confirmed about GTA VI')}</SectionTitle>
          <p className="mt-3 font-read text-[15px] text-muted">{t('Each row names its source. Rows without an official source stay marked until Rockstar says otherwise.')}</p>
          <table className="mt-5 hidden w-full border-collapse text-left lg:table">
            <thead>
              <tr className="border-t border-edge text-xs tracking-wide text-muted uppercase">
                {['Topic', 'What we know', 'Source', 'Status'].map(h => <th key={h} className="py-3 pr-6 font-semibold">{t(h)}</th>)}
              </tr>
            </thead>
            <tbody>
              {CONFIRMED.map(row => (
                <tr key={row.topic} className="border-t border-line align-top">
                  <th scope="row" className="w-[200px] py-3 pr-6 text-[15px] font-semibold">{t(row.topic)}</th>
                  <td className="py-3 pr-6 font-read text-[15px]/normal text-body">{t(row.text)}</td>
                  <td className="w-[260px] py-3 pr-6 text-sm text-muted">{t(row.source)}</td>
                  <td className="w-[170px] py-3"><Status kind={row.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4 lg:hidden">
            {CONFIRMED.map(row => (
              <div key={row.topic} className="flex flex-col gap-1 border-t border-line py-3">
                <h3 className="font-ui text-[15px] font-semibold">{t(row.topic)}</h3>
                <p className="font-read text-[15px]/normal text-body">{t(row.text)}</p>
                <Status kind={row.status} source={t(row.source)} />
              </div>
            ))}
          </div>
        </section>
      </Container>
    </>
  );
}
