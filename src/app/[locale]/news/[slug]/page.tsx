import { localize } from '@/i18n/localize';
import { pageLocale } from '@/i18n/page';
import { getT } from '@/i18n/server';
import { eq } from 'drizzle-orm';
import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ModeratorNewsLink } from '@/components/news/ModeratorNewsLink';
import { AdSlot } from '@/components/ui/AdSlot';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Container } from '@/components/ui/Container';
import { Meta } from '@/components/ui/Meta';
import { Status } from '@/components/ui/Status';
import { Tag } from '@/components/ui/Tag';
import { longDate } from '@/lib/format';
import { db, schema } from '@/server/db';

export const revalidate = 60;
export function generateStaticParams() {
  return [];
}

type Props = { params: Promise<{ locale: string; slug: string }> };

async function load(slug: string, locale: string) {
  const [row] = await db.select({ story: schema.news, game: schema.games.shortName }).from(schema.news).leftJoin(schema.games, eq(schema.news.gameId, schema.games.id)).where(eq(schema.news.slug, slug)).limit(1);
  return row ? { ...row, story: localize(row.story, locale) } : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const row = await load(slug, locale);
  return row ? { title: row.story.title, description: row.story.excerpt } : {};
}

export default async function StoryPage({ params }: Props) {
  const locale = await pageLocale(params);
  const t = await getT();
  const row = await load((await params).slug, locale);
  if (!row || row.story.sponsored) notFound();
  const { story, game } = row;
  return (
    <Container className="mt-6 mb-16 grid gap-10 lg:mt-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:gap-12">
      <article className="flex max-w-[760px] flex-col gap-4">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'News', href: '/news' }, { label: story.title }]} />
        <h1 className="text-[33px] lg:text-[56px]">{story.title}</h1>
        <div><ModeratorNewsLink href={`/news/${story.slug}/edit`} label={t('Edit story')} /></div>
        <Meta>
          {game && <Tag>{game}</Tag>}
          {story.status && <Status kind={story.status} source={story.source} />}
          <span>{longDate(story.publishedAt, locale)}</span>
        </Meta>
        {story.image && <div className="relative aspect-video overflow-hidden rounded-image"><Image src={`/media/${story.image}`} alt="" fill priority sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover" /></div>}
        <p className="font-read text-[17px]/[1.6] whitespace-pre-wrap text-body">{story.body}</p>
      </article>
      <aside><AdSlot size="300x250" /></aside>
    </Container>
  );
}
