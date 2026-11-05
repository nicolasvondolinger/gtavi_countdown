import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { SearchBox } from '@/components/layout/SearchBox';
import { AdSlot } from '@/components/ui/AdSlot';
import { Container } from '@/components/ui/Container';
import { Status } from '@/components/ui/Status';
import { Tag } from '@/components/ui/Tag';
import { search, type SearchFilters, type SearchType } from '@/server/search/queries';
import { getGames } from '@/server/wiki/queries';

export const metadata: Metadata = { title: 'Search', robots: { index: false } };

type Props = { searchParams: Promise<Record<string, string | undefined>> };

const TYPES: [SearchType, string][] = [['all', 'Everything'], ['pages', 'Wiki pages'], ['news', 'News'], ['threads', 'Forum threads']];
const STATUSES = [['official', 'Official'], ['leak', 'Unverified leak'], ['theory', 'Community theory']] as const;

export default async function SearchPage({ searchParams }: Props) {
  const p = await searchParams;
  const q = p.q ?? '';
  const type = (TYPES.some(([t]) => t === p.type) ? p.type : 'all') as SearchType;
  const status = STATUSES.some(([s]) => s === p.status) ? (p.status as SearchFilters['status']) : undefined;
  const [{ results, counts }, games] = await Promise.all([search(q, { type, status, game: p.game }), getGames()]);
  const total = counts.pages + counts.news + counts.threads;
  const href = (change: Record<string, string | undefined>) => {
    const next = new URLSearchParams();
    for (const [k, v] of Object.entries({ q, type, status, game: p.game, ...change })) if (v && !(k === 'type' && v === 'all')) next.set(k, v);
    return `/search?${next}`;
  };
  const [best, ...rest] = results;

  return (
    <Container className="mt-5 mb-16 lg:mt-8 lg:mb-20">
      <div className="lg:hidden"><SearchBox wide initial={q} /></div>
      {q && (
        <div className="-mx-4 mt-3 flex gap-2 overflow-x-auto px-4 lg:hidden">
          {TYPES.map(([t, label]) => <Tag key={t} href={href({ type: t })} active={t === type}>{label}</Tag>)}
        </div>
      )}
      <div className="mt-4 grid gap-10 lg:mt-0 lg:grid-cols-[220px_minmax(0,760px)_minmax(0,1fr)] lg:gap-12">
        <aside className="hidden flex-col gap-6 lg:flex">
          <div className="flex flex-col gap-1">
            <p className="mb-1 text-[13px] font-semibold text-muted">Type</p>
            {TYPES.map(([t, label]) => {
              const n = t === 'all' ? total : counts[t];
              return (
                <Link key={t} href={href({ type: t })} aria-current={t === type ? 'true' : undefined} className={`flex justify-between rounded-control px-2.5 py-1.5 text-[15px] ${t === type ? 'bg-raised font-semibold' : 'text-muted hover:text-text'}`}>
                  {label}<span className="font-data text-xs text-muted">{n}</span>
                </Link>
              );
            })}
          </div>
          <div className="flex flex-col gap-1">
            <p className="mb-1 text-[13px] font-semibold text-muted">Status</p>
            {STATUSES.map(([s]) => (
              <Link key={s} href={href({ status: s === status ? undefined : s })} aria-current={s === status ? 'true' : undefined} className={`rounded-control px-2.5 py-1.5 ${s === status ? 'bg-raised' : ''}`}>
                <Status kind={s} />
              </Link>
            ))}
          </div>
          <div className="flex flex-col gap-1">
            <p className="mb-1 text-[13px] font-semibold text-muted">Game</p>
            {games.filter(g => g.facts.length > 0).map(g => (
              <Link key={g.slug} href={href({ game: g.slug === p.game ? undefined : g.slug })} aria-current={g.slug === p.game ? 'true' : undefined} className={`rounded-control px-2.5 py-1.5 text-[15px] ${g.slug === p.game ? 'bg-raised font-semibold' : 'text-muted hover:text-text'}`}>
                {g.shortName}
              </Link>
            ))}
          </div>
        </aside>
        <section aria-label="Results">
          {!q && <h1 className="text-[33px]">Search the whole wiki</h1>}
          {q && <h1 className="pb-5 text-[33px] lg:text-[41px]">{total} {total === 1 ? 'result' : 'results'} for “{q}”</h1>}
          {q && total === 0 && <p className="font-read text-[15px] text-muted">Nothing matched. Check the spelling or try a shorter term.</p>}
          {best && (
            <Link href={best.href} className="group flex gap-4 rounded-panel border border-line bg-surface p-3 lg:gap-5 lg:p-4">
              {best.image && (
                <span className="relative h-[90px] w-[72px] shrink-0 overflow-hidden rounded-image lg:h-[150px] lg:w-[120px]">
                  <Image src={`/media/${best.image}`} alt="" fill sizes="120px" className="object-cover" />
                </span>
              )}
              <span className="flex min-w-0 flex-col gap-1.5">
                <span className="text-[13px] text-muted">{best.label}</span>
                <span className="font-display text-[26px] leading-tight font-semibold group-hover:text-accent lg:text-[33px]">{best.title}</span>
                <span className="font-read text-[15px]/normal text-body">{best.text}</span>
                {best.status && <Status kind={best.status} source={best.source} />}
              </span>
            </Link>
          )}
          <div className="mt-2">
            {rest.map(r => (
              <article key={r.key} className="flex gap-5 border-t border-line py-4">
                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <p className="text-[13px] text-muted">{r.label}</p>
                  <h2 className="font-ui text-[17px] font-semibold lg:text-[21px]"><Link href={r.href} className="hover:text-accent">{r.title}</Link></h2>
                  <p className="font-read text-[15px]/normal text-soft">{r.text}</p>
                  {r.status && <Status kind={r.status} source={r.source} />}
                </div>
                {r.image && (
                  <span className="relative hidden h-[88px] w-[140px] shrink-0 overflow-hidden rounded-image sm:block">
                    <Image src={`/media/${r.image}`} alt="" fill sizes="140px" className="object-cover" />
                  </span>
                )}
              </article>
            ))}
          </div>
        </section>
        <aside className="hidden lg:block"><AdSlot size="300x250" /></aside>
      </div>
    </Container>
  );
}
