import { getLocale } from 'next-intl/server';
import { localize } from '@/i18n/localize';
import { TimeAgo } from '@/components/ui/TimeAgo';
import { localizedMeta } from '@/i18n/page';
import { getT } from '@/i18n/server';
import { desc, eq } from 'drizzle-orm';
import { Link } from '@/i18n/navigation';
import { Container } from '@/components/ui/Container';
import { Tag } from '@/components/ui/Tag';
import { db, schema } from '@/server/db';
import { SITE_NAME } from '@/lib/site';
import { REVIEWERS_REQUIRED } from '@/server/wiki/review';
import { sql } from 'drizzle-orm';

export const generateMetadata = localizedMeta({ title: 'Recent changes', description: 'Every edit made to GTA Wiki, and the edits waiting for review.' });

const { revisions, revisionVotes, pages, games, profiles } = schema;
const STATE = { pending: ['Pending', 'text-leak'], accepted: ['Accepted', 'text-muted'], reverted: ['Reverted', 'text-removed'] } as const;

export default async function ChangesPage({ searchParams }: { searchParams: Promise<{ filter?: string }> }) {
  const t = await getT();
  const locale = await getLocale();
  const pending = (await searchParams).filter === 'pending';
  const rows = await db
    .select({ id: revisions.id, summary: revisions.summary, sizeDelta: revisions.sizeDelta, state: revisions.state, createdAt: revisions.createdAt, title: pages.title, i18n: pages.i18n, section: pages.section, slug: pages.slug, game: games.shortName, gameSlug: games.slug, author: profiles.username, votes: sql<number>`(select count(*)::int from ${revisionVotes} where ${revisionVotes.revisionId} = ${revisions.id})` })
    .from(revisions)
    .innerJoin(pages, eq(revisions.pageId, pages.id))
    .innerJoin(games, eq(pages.gameId, games.id))
    .leftJoin(profiles, eq(revisions.authorId, profiles.userId))
    .where(pending ? eq(revisions.state, 'pending') : undefined)
    .orderBy(desc(revisions.createdAt))
    .limit(100);

  return (
    <Container className="mt-6 mb-16 flex flex-col gap-4 lg:mt-8 lg:mb-20">
      <h1 className="text-[41px] lg:text-[56px]">{pending ? t('Waiting for review') : t('Recent changes')}</h1>
      <div className="flex gap-2">
        <Tag href="/changes" active={!pending}>{t('All edits')}</Tag>
        <Tag href="/changes?filter=pending" active={pending}>{t('Waiting for review')}</Tag>
      </div>
      {rows.length === 0 && <p className="font-read text-[15px] text-muted">{t('Nothing here.')}</p>}
      <ul>
        {rows.map(r => (
          <li key={r.id} className="border-t border-line">
            <Link href={`/${r.gameSlug}/${r.section}/${r.slug}/history?rev=${r.id}`} className="group flex flex-wrap items-baseline gap-x-4 gap-y-1 py-3">
              <span className="w-full text-[15px] font-semibold group-hover:text-accent lg:w-[260px]">{localize(r, locale).title} <span className="font-normal text-muted">{r.game}</span></span>
              <span className="min-w-0 flex-1 text-sm text-soft">{t(r.summary)}</span>
              <span className={`font-data text-[13px] ${r.sizeDelta >= 0 ? 'text-added' : 'text-removed'}`}>{r.sizeDelta >= 0 ? '+' : ''}{r.sizeDelta}</span>
              {r.state === 'pending' && <span className="font-data text-xs text-muted">{t('{n} of {total}', { n: r.votes, total: REVIEWERS_REQUIRED })}</span>}
              <span className={`text-sm font-semibold ${STATE[r.state][1]}`}>{t(STATE[r.state][0])}</span>
              <span className="font-data text-xs text-muted">{r.author ?? SITE_NAME} · <TimeAgo date={r.createdAt} /></span>
            </Link>
          </li>
        ))}
      </ul>
    </Container>
  );
}
