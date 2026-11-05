import { TimeAgo } from '@/components/ui/TimeAgo';
import { pageLocale } from '@/i18n/page';
import { getT } from '@/i18n/server';
import type { Metadata } from 'next';
import { Link } from '@/i18n/navigation';
import { notFound } from 'next/navigation';
import { Gallery } from '@/components/article/Gallery';
import { Infobox } from '@/components/article/Infobox';
import { Markdown } from '@/components/article/Markdown';
import { Talk } from '@/components/article/Talk';
import { Theories } from '@/components/article/Theories';
import { AdSlot } from '@/components/ui/AdSlot';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Container } from '@/components/ui/Container';
import { JsonLd } from '@/components/ui/JsonLd';
import { Meta } from '@/components/ui/Meta';
import { Status } from '@/components/ui/Status';
import { Tag } from '@/components/ui/Tag';
import { MyVotes } from '@/components/ui/Votes';
import { SECTION_LABEL, isSection } from '@/lib/sections';
import { tableOfContents } from '@/lib/toc';
import { getComments, getTheories, type Discussion } from '@/server/wiki/community';
import { getPage } from '@/server/wiki/queries';

export const revalidate = 60;
export function generateStaticParams() {
  return [];
}

type Props = { params: Promise<{ locale: string; game: string; section: string; slug: string }> };

async function load({ params }: Props) {
  const { locale, game, section, slug } = await params;
  return isSection(section) ? getPage(game, section, slug, locale) : null;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const row = await load(props);
  if (!row) return {};
  const title = `${row.page.title} (${row.game.shortName})`;
  return { title, description: row.page.summary, openGraph: { title, description: row.page.summary, type: 'article', ...(row.page.image ? { images: [`/media/${row.page.image}`] } : {}) } };
}

export default async function ArticlePage(props: Props) {
  await pageLocale(props.params);
  const t = await getT();
  const row = await load(props);
  if (!row) notFound();
  const { page, game, revision, translated } = row;
  const label = SECTION_LABEL[page.section];
  const base = `/${game.slug}/${page.section}/${page.slug}`;
  const body = revision?.body ?? page.summary;
  const toc = tableOfContents(body);
  const [theories, comments] = await Promise.all([getTheories(page.id), getComments(page.id)]);
  const commentIds = (list: Discussion[]): number[] => list.flatMap(c => [c.id, ...commentIds(c.replies)]);

  return (
    <>
      <Container className="mt-5 mb-16 flex flex-col gap-6 lg:mt-7 lg:mb-20 lg:grid lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-10 min-[87.5rem]:grid-cols-[180px_minmax(0,660px)_minmax(0,1fr)] min-[87.5rem]:gap-12">
        <nav aria-label={t('On this page')} className="sticky top-6 hidden flex-col gap-3 self-start pt-[92px] min-[87.5rem]:flex">
          <p className="text-[13px] font-semibold">{t('On this page')}</p>
          {toc.map(item => <a key={item.id} href={`#${item.id}`} className="text-sm text-muted hover:text-text">{item.label}</a>)}
          {page.gallery.length > 0 && <a href="#gallery" className="text-sm text-muted hover:text-text">{t('Gallery')}</a>}
          <a href="#theories" className="text-sm text-muted hover:text-text">{t('Theories')}</a>
          <a href="#talk" className="text-sm text-muted hover:text-text">{t('Talk')}</a>
        </nav>
        <article className="flex min-w-0 flex-col gap-4 lg:gap-5">
          <JsonLd data={{ '@context': 'https://schema.org', '@type': 'Article', headline: page.title, description: page.summary, dateModified: revision?.createdAt.toISOString(), ...(page.image ? { image: `/media/${page.image}` } : {}), about: game.name }} />
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Games', href: '/games' }, { label: game.shortName, href: `/${game.slug}` }, { label, href: `/${game.slug}/${page.section}` }, { label: page.title }]} />
          <h1 className="text-[41px] lg:text-[72px]">{page.title}</h1>
          <Meta>
            <Tag href={`/${game.slug}`}>{game.shortName}</Tag>
            {page.status && <Status kind={page.status} source={page.source} />}
            {revision?.sourceKind === 'community' && <Status kind="leak" source={revision.source} />}
            {revision && <span>{t('Edited')} <TimeAgo date={revision.createdAt} /></span>}
          </Meta>
          <div className="flex gap-6 border-b border-line">
            <span aria-current="page" className="border-b-2 border-accent py-2 text-[15px] font-semibold">{t('Article')}</span>
            <a href="#talk" className="py-2 text-[15px] text-muted hover:text-text">{t('Talk ({n})', { n: commentIds(comments).length })}</a>
            <Link href={`${base}/edit`} className="py-2 text-[15px] text-muted hover:text-text">{t('Edit')}</Link>
            <Link href={`${base}/history`} className="py-2 text-[15px] text-muted hover:text-text">{t('History')}</Link>
          </div>
          {!translated && <p className="border-l-2 border-edge pl-3 text-sm text-muted">{t('This page has no Portuguese text yet, so it appears in English.')} <Link href={`${base}/edit`} className="font-semibold text-accent hover:underline">{t('Translate it')}</Link></p>}
          <div className="lg:hidden"><Infobox page={page} game={game} /></div>
          <Markdown>{body}</Markdown>
          <Gallery images={page.gallery} title={page.title} />
          <MyVotes ids={{ theory: theories.map(t => t.id), comment: commentIds(comments) }}>
            <div className="mt-4 flex flex-col gap-8">
              <Theories theories={theories} pageId={page.id} path={base} />
              <Talk comments={comments} pageId={page.id} path={base} />
            </div>
          </MyVotes>
        </article>
        <div className="hidden flex-col gap-8 lg:flex">
          <Infobox page={page} game={game} />
          <AdSlot size="300x600" />
        </div>
      </Container>
    </>
  );
}
