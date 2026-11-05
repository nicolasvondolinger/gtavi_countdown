import { TimeAgo } from '@/components/ui/TimeAgo';
import { getLocale } from 'next-intl/server';
import { getT } from '@/i18n/server';
import { number } from '@/lib/format';
import type { Metadata } from 'next';
import { Link } from '@/i18n/navigation';
import { notFound } from 'next/navigation';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { REP_RULES, levelFor, repForLevel } from '@/lib/account';
import { signOut } from '@/server/account/actions';
import { getProfile, getUserBuilds, getUserEdits, getUserTheories, getUserThreads, getUserTotals } from '@/server/account/queries';
import { getViewer } from '@/server/auth/session';

type Props = { params: Promise<{ username: string }>; searchParams: Promise<{ tab?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: (await params).username, robots: { index: false } };
}

const STATE_LABEL = { pending: 'Pending', accepted: 'Kept', reverted: 'Reverted' } as const;

export default async function ProfilePage({ params, searchParams }: Props) {
  const tr = await getT();
  const locale = await getLocale();
  const profile = await getProfile((await params).username);
  if (!profile) notFound();
  const tab = (await searchParams).tab ?? 'edits';
  const [totals, viewer] = await Promise.all([getUserTotals(profile.userId), getViewer()]);
  const edits = tab === 'edits' ? await getUserEdits(profile.userId) : [];
  const threads = tab === 'threads' ? await getUserThreads(profile.userId) : [];
  const builds = tab === 'builds' ? await getUserBuilds(profile.userId) : [];
  const theories = tab === 'theories' ? await getUserTheories(profile.userId) : [];
  const level = levelFor(profile.rep);
  const floor = repForLevel(level);
  const ceiling = repForLevel(level + 1);
  const progress = Math.min(100, Math.round(((profile.rep - floor) / (ceiling - floor)) * 100));
  const keptShare = totals.edits ? Math.round((totals.kept / totals.edits) * 100) : null;
  const tabs = [['edits', 'Wiki edits', totals.edits], ['theories', 'Theories', totals.theories], ['threads', 'Threads', totals.threads], ['builds', 'Builds', totals.builds]] as const;

  return (
    <Container className="mt-6 mb-16 flex flex-col gap-6 lg:mt-10 lg:mb-20 lg:gap-8">
      <header className="flex items-center gap-3.5 lg:gap-7">
        <span className="lg:hidden"><Avatar avatar={profile.avatar} size={72} alt="" /></span>
        <span className="hidden lg:block"><Avatar avatar={profile.avatar} size={132} alt="" /></span>
        <div className="flex min-w-0 flex-1 flex-col gap-1 lg:gap-2.5">
          <h1 className="text-[26px] break-words lg:text-[56px]">{profile.username}</h1>
          <p className="text-[13px] text-muted lg:text-[15px]">{tr('Level {n}', { n: level })}</p>
          <p className="hidden font-read text-[17px] text-body lg:block">{keptShare !== null ? tr('{n} wiki edits, {share}% kept after review.', { n: totals.edits, share: keptShare }) : tr('{n} wiki edits.', { n: totals.edits })}</p>
        </div>
        {viewer?.user.id === profile.userId && <form action={signOut}><Button kind="secondary">{tr('Sign out')}</Button></form>}
      </header>
      <nav aria-label={tr('Profile sections')} className="flex gap-7 overflow-x-auto border-b border-line">
        {tabs.map(([key, label, n]) => (
          <Link key={key} href={`?tab=${key}`} aria-current={key === tab ? 'page' : undefined} className={`-mb-px border-b-2 py-2 text-[15px] whitespace-nowrap ${key === tab ? 'border-accent font-semibold' : 'border-transparent text-muted hover:text-text'}`}>{label} ({n})</Link>
        ))}
      </nav>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-12">
        <section aria-label={tr('Activity')}>
          {edits.map(e => (
            <div key={e.id} className="flex items-start gap-3 border-t border-line py-3">
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <Link href={`/${e.gameSlug}/${e.section}/${e.slug}/history`} className="text-[15px] font-semibold hover:text-accent">{e.title} <span className="font-normal text-muted">{e.game}</span></Link>
                <p className="text-sm text-soft">{tr(e.summary)}</p>
                <p className="font-data text-xs text-muted"><TimeAgo date={e.createdAt} /></p>
              </div>
              <span className={`font-data text-[13px] ${e.sizeDelta >= 0 ? 'text-added' : 'text-removed'}`}>{e.sizeDelta >= 0 ? '+' : ''}{e.sizeDelta}</span>
              <span className={`w-16 text-sm font-semibold ${e.state === 'pending' ? 'text-leak' : 'text-muted'}`}>{tr(STATE_LABEL[e.state])}</span>
            </div>
          ))}
          {theories.map(t => (
            <div key={t.id} className="flex flex-col gap-1 border-t border-line py-3">
              <Link href={`/${t.gameSlug}/${t.section}/${t.slug}#theories`} className="text-[15px] font-semibold hover:text-accent">{t.title}</Link>
              <p className="text-[13px] text-muted">{tr('On {page} · {n} votes', { page: t.page, n: t.score })} · <TimeAgo date={t.createdAt} /></p>
            </div>
          ))}
          {threads.map(t => (
            <div key={t.id} className="flex flex-col gap-1 border-t border-line py-3">
              <Link href={`/forums/${t.channelSlug}/${t.slug}`} className="text-[15px] font-semibold hover:text-accent">{t.title}</Link>
              <p className="text-[13px] text-muted">{t.channel} · {tr('{n} replies', { n: t.replies })} · <TimeAgo date={t.createdAt} /></p>
            </div>
          ))}
          {builds.map(b => (
            <div key={b.id} className="flex flex-col gap-1 border-t border-line py-3">
              <Link href={`/b/${b.code}`} className="text-[15px] font-semibold hover:text-accent">{b.name}</Link>
              <p className="text-[13px] text-muted">{b.vehicle} · <TimeAgo date={b.createdAt} /></p>
            </div>
          ))}
          {edits.length + theories.length + threads.length + builds.length === 0 && <p className="font-read text-[15px] text-muted">{tr('Nothing here yet.')}</p>}
        </section>
        <aside aria-label={tr('Reputation')} className="flex flex-col gap-3.5 self-start rounded-panel border border-line bg-surface p-5">
          <h2 className="font-ui text-[17px] font-semibold">{tr('Reputation')}</h2>
          <p className="flex items-baseline gap-2"><span className="font-data text-[33px] font-bold">{number(profile.rep, locale)}</span><span className="text-muted">rep</span></p>
          <div className="h-1.5 bg-raised"><div className="h-full bg-accent" style={{ width: `${progress}%` }} /></div>
          <p className="text-[13px] text-muted">{tr('{n} to level {level}', { n: number(ceiling - profile.rep, locale), level: level + 1 })}</p>
          <hr className="border-line" />
          <h3 className="font-ui text-sm font-semibold">{tr('How rep is earned')}</h3>
          <dl className="flex flex-col gap-2">
            {REP_RULES.map(([label, amount]) => (
              <div key={label} className="flex justify-between">
                <dt className="text-sm text-soft">{tr(label)}</dt>
                <dd className={`font-data text-[13px] ${amount < 0 ? 'text-removed' : ''}`}>{amount > 0 ? '+' : ''}{amount}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>
    </Container>
  );
}
