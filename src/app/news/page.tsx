import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ModeratorNewsLink } from '@/components/news/ModeratorNewsLink';
import { AdSlot } from '@/components/ui/AdSlot';
import { Container } from '@/components/ui/Container';
import { Icon } from '@/components/ui/Icon';
import { Meta } from '@/components/ui/Meta';
import { Status } from '@/components/ui/Status';
import { Tag } from '@/components/ui/Tag';
import { clock, longDate } from '@/lib/format';
import { getNews, type FeedItem } from '@/server/wiki/queries';

export const metadata: Metadata = { title: 'News and rumors', description: 'Grand Theft Auto news, leaks and theories, each labelled with its source.' };

const FILTERS = [[undefined, 'Everything'], ['official', 'Official only'], ['leak', 'Unverified leaks'], ['theory', 'Community theories']] as const;

function groupByDay(items: FeedItem[]) {
  const days = new Map<string, FeedItem[]>();
  for (const item of items) {
    const day = longDate(item.publishedAt);
    days.set(day, [...(days.get(day) ?? []), item]);
  }
  return [...days];
}

export default async function NewsPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const status = (await searchParams).status;
  const all = await getNews(60);
  const feed = all.filter(n => !status || n.status === status || n.sponsored);
  const lead = feed.find(n => n.status === 'official' && n.image) ?? feed.find(n => !n.sponsored);
  const rest = feed.filter(n => n !== lead);

  return (
    <Container className="mt-6 mb-16 grid gap-10 lg:mt-8 lg:mb-20 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:gap-12">
      <div className="flex min-w-0 flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-[41px] lg:text-[56px]">News and rumors</h1>
          <ModeratorNewsLink href="/news/new" label="New story" />
        </div>
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 lg:mx-0 lg:px-0">
          {FILTERS.map(([value, label]) => <span key={label} className="shrink-0"><Tag href={value ? `?status=${value}` : '/news'} active={status === value}>{label}</Tag></span>)}
        </div>
        {lead && (
          <article className="flex flex-col gap-3 pt-3 pb-2">
            {lead.image && <div className="relative -mx-4 aspect-video overflow-hidden lg:mx-0 lg:rounded-image"><Image src={`/media/${lead.image}`} alt="" fill priority sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover" /></div>}
            <Meta>
              {lead.game && <Tag>{lead.game}</Tag>}
              {lead.status && <Status kind={lead.status} source={lead.source} />}
            </Meta>
            <h2 className="text-[26px] lg:text-[41px]"><Link href={`/news/${lead.slug}`} className="hover:text-accent">{lead.title}</Link></h2>
            <p className="font-read text-base/[1.6] text-body lg:text-[17px]">{lead.excerpt}</p>
          </article>
        )}
        {groupByDay(rest).map(([day, items]) => (
          <section key={day} aria-label={day}>
            <h3 className="mb-2 font-ui text-[15px] font-semibold text-muted">{day}</h3>
            {items.map(item => (
              <div key={item.id} className="flex gap-5 border-t border-line py-3.5">
                <span className="hidden w-12 shrink-0 font-data text-xs text-muted lg:block">{clock(item.publishedAt)}</span>
                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                  {item.sponsored ? <p className="text-[17px] font-semibold lg:text-[19px]">{item.title}</p> : <h4 className="font-ui text-[17px] font-semibold lg:text-[19px]"><Link href={`/news/${item.slug}`} className="hover:text-accent">{item.title}</Link></h4>}
                  <Meta>
                    {item.sponsored && <span>Sponsored</span>}
                    {item.game && <Tag>{item.game}</Tag>}
                    {item.status && <Status kind={item.status} />}
                    <span>{item.source}</span>
                  </Meta>
                </div>
                {item.sponsored ? <div className="hidden h-[84px] w-[150px] shrink-0 border border-dashed border-line sm:block" /> : item.image && (
                  <div className="relative h-[54px] w-24 shrink-0 overflow-hidden rounded-image lg:h-[84px] lg:w-[150px]"><Image src={`/media/${item.image}`} alt="" fill sizes="150px" className="object-cover" /></div>
                )}
              </div>
            ))}
          </section>
        ))}
        {feed.length === 0 && <p className="font-read text-[15px] text-muted">No stories with this label yet.</p>}
      </div>
      <aside className="flex flex-col gap-7">
        <section aria-label="How stories are labelled" className="flex flex-col gap-3 rounded-panel border border-line p-4.5">
          <h2 className="font-ui text-[17px] font-semibold">How stories are labelled</h2>
          <Status kind="official" />
          <p className="font-read text-sm text-muted">Rockstar, platform holders or ratings boards said it.</p>
          <Status kind="leak" />
          <p className="font-read text-sm text-muted">From datamines, insiders or leaked footage. Can be wrong.</p>
          <Status kind="theory" />
          <p className="font-read text-sm text-muted">Reasoned guesses from the community, ranked by votes.</p>
        </section>
        <div className="hidden lg:block"><AdSlot size="300x600" /></div>
        <p className="hidden items-center gap-1 text-[13px] text-dim lg:flex"><Icon name="warning" size={14} />Report a wrong label in the forums.</p>
      </aside>
    </Container>
  );
}
