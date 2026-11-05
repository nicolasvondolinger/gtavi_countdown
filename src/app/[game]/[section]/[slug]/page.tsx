import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Infobox } from '@/components/article/Infobox';
import { Markdown } from '@/components/article/Markdown';
import { AdSlot } from '@/components/ui/AdSlot';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Container } from '@/components/ui/Container';
import { Meta } from '@/components/ui/Meta';
import { Status } from '@/components/ui/Status';
import { Tag } from '@/components/ui/Tag';
import { timeAgo } from '@/lib/format';
import { SECTION_LABEL, isSection } from '@/lib/sections';
import { tableOfContents } from '@/lib/toc';
import { getPage } from '@/server/wiki/queries';

export const revalidate = 60;
export function generateStaticParams() {
  return [];
}

type Props = { params: Promise<{ game: string; section: string; slug: string }> };

async function load({ params }: Props) {
  const { game, section, slug } = await params;
  return isSection(section) ? getPage(game, section, slug) : null;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const row = await load(props);
  return row ? { title: `${row.page.title} (${row.game.shortName})`, description: row.page.summary } : {};
}

export default async function ArticlePage(props: Props) {
  const row = await load(props);
  if (!row) notFound();
  const { page, game, revision } = row;
  const label = SECTION_LABEL[page.section];
  const base = `/${game.slug}/${page.section}/${page.slug}`;
  const body = revision?.body ?? page.summary;
  const toc = tableOfContents(body);

  return (
    <>
      <Container className="mt-5 mb-16 flex flex-col gap-6 lg:mt-7 lg:mb-20 lg:grid lg:grid-cols-[180px_minmax(0,660px)_minmax(0,1fr)] lg:gap-10 xl:gap-12">
        <nav aria-label="On this page" className="sticky top-6 hidden flex-col gap-3 self-start pt-[92px] lg:flex">
          <p className="text-[13px] font-semibold">On this page</p>
          {toc.map(item => <a key={item.id} href={`#${item.id}`} className="text-sm text-muted hover:text-text">{item.label}</a>)}
          <a href="#talk" className="text-sm text-muted hover:text-text">Talk</a>
        </nav>
        <article className="flex min-w-0 flex-col gap-4 lg:gap-5">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Games', href: '/games' }, { label: game.shortName, href: `/${game.slug}` }, { label, href: `/${game.slug}/${page.section}` }, { label: page.title }]} />
          <h1 className="text-[41px] lg:text-[72px]">{page.title}</h1>
          <Meta>
            <Tag href={`/${game.slug}`}>{game.shortName}</Tag>
            {page.status && <Status kind={page.status} source={page.source} />}
            {revision && <span>Edited {timeAgo(revision.createdAt)}</span>}
          </Meta>
          <div className="flex gap-6 border-b border-line">
            <span aria-current="page" className="border-b-2 border-accent py-2 text-[15px] font-semibold">Article</span>
            <a href="#talk" className="py-2 text-[15px] text-muted hover:text-text">Talk</a>
            <Link href={`${base}/edit`} className="py-2 text-[15px] text-muted hover:text-text">Edit</Link>
            <Link href={`${base}/history`} className="py-2 text-[15px] text-muted hover:text-text">History</Link>
          </div>
          <div className="lg:hidden"><Infobox page={page} game={game} /></div>
          <Markdown>{body}</Markdown>
        </article>
        <div className="hidden flex-col gap-8 lg:flex">
          <Infobox page={page} game={game} />
          <AdSlot size="300x600" />
        </div>
      </Container>
    </>
  );
}
