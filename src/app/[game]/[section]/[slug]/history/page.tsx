import { diffLines } from 'diff';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Avatar } from '@/components/ui/Avatar';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Status } from '@/components/ui/Status';
import { Tag } from '@/components/ui/Tag';
import { timeAgo } from '@/lib/format';
import { SECTION_LABEL, isSection } from '@/lib/sections';
import { getViewer } from '@/server/auth/session';
import { voteOnEdit } from '@/server/wiki/actions';
import { getPage } from '@/server/wiki/queries';
import { REVIEWERS_REQUIRED, canReview, getHistory, getMyReviewVote, getRevisionBodies } from '@/server/wiki/review';

type Props = { params: Promise<{ game: string; section: string; slug: string }>; searchParams: Promise<{ rev?: string; filter?: string }> };

export const metadata: Metadata = { title: 'Revision history', robots: { index: false } };

const STATE = { pending: ['Pending', 'text-leak'], accepted: ['Accepted', 'text-muted'], reverted: ['Reverted', 'text-removed'] } as const;
const FILTERS = [['all', 'All edits'], ['pending', 'Waiting for review'], ['reverted', 'Reverted']] as const;

export default async function HistoryPage({ params, searchParams }: Props) {
  const { game, section, slug } = await params;
  const row = isSection(section) ? await getPage(game, section, slug) : null;
  if (!row) notFound();
  const query = await searchParams;
  const filter = query.filter ?? 'all';
  const all = await getHistory(row.page.id);
  const list = filter === 'all' ? all : all.filter(r => r.state === filter);
  const selected = all.find(r => r.id === Number(query.rev)) ?? all.find(r => r.state === 'pending') ?? all[0];
  const bodies = selected ? await getRevisionBodies(selected.id) : null;
  const viewer = await getViewer();
  const mine = viewer && selected ? await getMyReviewVote(selected.id, viewer.user.id) : null;
  const eligible = !!viewer && canReview(viewer.profile) && selected?.authorId !== viewer.user.id;
  const path = `/${game}/${section}/${slug}`;
  const voted = selected ? selected.keep + selected.revert : 0;

  return (
    <Container className="mt-5 mb-16 flex flex-col gap-5 lg:mt-7 lg:mb-20">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Games', href: '/games' }, { label: row.game.shortName, href: `/${game}` }, { label: SECTION_LABEL[row.page.section], href: `/${game}/${section}` }, { label: row.page.title, href: path }, { label: 'History' }]} />
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-[41px] lg:text-[56px]">Revision history</h1>
          <p className="font-read text-[15px] text-muted">{all.length} revisions. Edits without an official source wait for {REVIEWERS_REQUIRED} reviewers.</p>
        </div>
        <div className="flex gap-2">
          {FILTERS.map(([key, label]) => <Tag key={key} href={`?filter=${key}`} active={key === filter}>{label}</Tag>)}
        </div>
      </div>
      <ul>
        {list.map(r => (
          <li key={r.id}>
            <Link href={`?rev=${r.id}&filter=${filter}`} aria-current={r.id === selected?.id ? 'true' : undefined} className={`grid grid-cols-[auto_1fr_auto] items-center gap-x-3 gap-y-1 border-t border-line px-2.5 py-3 lg:flex lg:gap-5 ${r.id === selected?.id ? 'bg-raised' : 'hover:bg-surface'}`}>
              <span className="order-3 col-span-3 font-data text-xs text-muted lg:order-none lg:w-[110px] lg:shrink-0">{timeAgo(r.createdAt)}</span>
              <span className="flex items-center gap-2 lg:w-[170px] lg:shrink-0">
                <Avatar avatar={r.avatar} size={22} />
                <span className="truncate text-sm font-semibold">{r.author ?? 'GTA Wiki'}</span>
              </span>
              <span className={`justify-self-end font-data text-[13px] lg:w-[60px] lg:shrink-0 ${r.sizeDelta >= 0 ? 'text-added' : 'text-removed'}`}>{r.sizeDelta >= 0 ? '+' : ''}{r.sizeDelta}</span>
              <span className="col-span-3 text-[15px] lg:flex-1 lg:text-sm">{r.summary}</span>
              <span className="hidden w-[90px] shrink-0 font-data text-xs text-muted lg:block">{r.keep} keep · {r.revert}</span>
              <span className={`text-[13px] font-semibold lg:w-[80px] lg:shrink-0 lg:text-sm ${STATE[r.state][1]}`}>{STATE[r.state][0]}</span>
            </Link>
          </li>
        ))}
      </ul>
      {selected && bodies && (
        <div className="mt-2 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <section aria-label="Changes" className="flex flex-col gap-3">
            <h2 className="text-[26px]">Changes in this edit</h2>
            <div className="overflow-hidden rounded-control border border-line py-1.5">
              {diffLines(bodies.before, bodies.after).filter(p => (p.added || p.removed || p.count! <= 3)).map((part, i) => (
                <pre key={i} className={`px-2.5 py-1 font-data text-[13px]/[1.55] whitespace-pre-wrap ${part.added ? 'bg-added/10' : part.removed ? 'bg-removed/10' : 'text-muted'}`}>
                  <span aria-hidden="true" className={part.added ? 'text-added' : part.removed ? 'text-removed' : 'text-dim'}>{part.added ? '+ ' : part.removed ? '- ' : '  '}</span>
                  <span className="sr-only">{part.added ? 'Added: ' : part.removed ? 'Removed: ' : ''}</span>
                  {part.value}
                </pre>
              ))}
            </div>
          </section>
          {selected.state === 'pending' && (
            <aside aria-label="Review this edit" className="flex flex-col gap-3.5 self-start rounded-panel border border-line bg-surface p-4.5">
              <h2 className="text-[26px]">Review this edit</h2>
              {selected.sourceKind === 'community' ? (
                <>
                  <p className="font-read text-sm/normal text-body">The source is a community one, so this text would show as an unverified leak if accepted.</p>
                  <Status kind="leak" source={selected.source} />
                </>
              ) : (
                <p className="font-read text-sm/normal text-body">This edit has no source. Keep it only if it changes nothing factual.</p>
              )}
              <dl className="grid grid-cols-3 gap-3">
                <div><dd className="font-data text-[26px] font-bold text-added">{selected.keep}</dd><dt className="text-[13px] text-muted">keep</dt></div>
                <div><dd className="font-data text-[26px] font-bold text-removed">{selected.revert}</dd><dt className="text-[13px] text-muted">revert</dt></div>
                <div><dd className="font-data text-[26px] font-bold">{voted} of {REVIEWERS_REQUIRED}</dd><dt className="text-[13px] text-muted">reviewers</dt></div>
              </dl>
              {eligible ? (
                <form action={voteOnEdit} className="grid grid-cols-2 gap-2.5">
                  <input type="hidden" name="path" value={path} />
                  <input type="hidden" name="revisionId" value={selected.id} />
                  <Button name="vote" value="keep" kind={mine === 'keep' ? 'primary' : 'secondary'}>Keep</Button>
                  <Button name="vote" value="revert" kind={mine === 'revert' ? 'primary' : 'secondary'}>Revert</Button>
                </form>
              ) : (
                <p className="text-[13px] text-muted">{!viewer ? 'Sign in to review.' : selected.authorId === viewer.user.id ? 'You can’t review your own edit.' : 'Reviewers need 500 rep.'}</p>
              )}
            </aside>
          )}
        </div>
      )}
    </Container>
  );
}
