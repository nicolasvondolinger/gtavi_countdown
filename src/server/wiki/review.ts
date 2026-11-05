import { and, asc, desc, eq, sql } from 'drizzle-orm';
import { REP } from '@/lib/account';
import { isOfficialSource } from '@/lib/sources';
import { db, schema } from '@/server/db';
import { awardRep } from '@/server/reputation';

const { revisions, revisionVotes, pages, profiles } = schema;

export const REVIEWERS_REQUIRED = 5;

export class ReviewError extends Error {}

export type EditInput = { pageId: number; authorId: string; baseRevisionId: number; body: string; summary: string; sourceKind: 'official' | 'community' | 'none'; source?: string | null };

export function canReview(profile: { role: string; rep: number }) {
  return profile.role !== 'member' || profile.rep >= REP.reviewerThreshold;
}

// An edit with a verifiable official source goes live; anything else waits for reviewers.
export async function createRevision(input: EditInput) {
  const { pageId, authorId, baseRevisionId, body, summary, sourceKind, source } = input;
  const official = sourceKind === 'official' && isOfficialSource(source);
  if (sourceKind === 'official' && !official) throw new ReviewError('An official source must be a link to Rockstar, Take-Two, PlayStation, Xbox or the ESRB.');
  if (sourceKind === 'community' && !source?.trim()) throw new ReviewError('Name the source for this edit.');

  return db.transaction(async tx => {
    const [page] = await tx.select().from(pages).where(eq(pages.id, pageId)).for('update');
    if (!page) throw new ReviewError('This page no longer exists.');
    if (page.currentRevisionId !== baseRevisionId) throw new ReviewError('The page changed while you were editing. Reload it and apply your edit again.');
    const [base] = await tx.select({ body: revisions.body }).from(revisions).where(eq(revisions.id, baseRevisionId));
    if (base?.body === body) throw new ReviewError('Nothing changed.');
    const pendingByAuthor = await tx.$count(revisions, and(eq(revisions.pageId, pageId), eq(revisions.authorId, authorId), eq(revisions.state, 'pending')));
    if (pendingByAuthor > 0 && !official) throw new ReviewError('You already have an edit waiting for review on this page.');

    const [revision] = await tx
      .insert(revisions)
      .values({ pageId, authorId, parentId: baseRevisionId, body, summary, sourceKind, source: source || null, state: official ? 'accepted' : 'pending', sizeDelta: body.length - (base?.body.length ?? 0), closedAt: official ? new Date() : null })
      .returning();
    if (official) {
      await tx.update(pages).set({ currentRevisionId: revision!.id }).where(eq(pages.id, pageId));
      await awardRep(tx, authorId, 'edit_accepted', REP.editAccepted, `revision:${revision!.id}`);
    }
    return revision!;
  });
}

export async function castReviewVote(revisionId: number, userId: string, vote: 'keep' | 'revert') {
  return db.transaction(async tx => {
    // The lock serialises votes, so the fifth vote closes the review exactly once.
    const [revision] = await tx.select().from(revisions).where(eq(revisions.id, revisionId)).for('update');
    if (!revision) throw new ReviewError('This edit no longer exists.');
    if (revision.state !== 'pending') throw new ReviewError('This review is already closed.');
    if (revision.authorId === userId) throw new ReviewError('You can’t review your own edit.');
    const [profile] = await tx.select().from(profiles).where(eq(profiles.userId, userId));
    if (!profile || !canReview(profile)) throw new ReviewError(`Reviewers need ${REP.reviewerThreshold} rep.`);

    await tx.insert(revisionVotes).values({ revisionId, userId, vote }).onConflictDoUpdate({ target: [revisionVotes.revisionId, revisionVotes.userId], set: { vote } });
    const votes = await tx.select({ vote: revisionVotes.vote }).from(revisionVotes).where(eq(revisionVotes.revisionId, revisionId));
    if (votes.length < REVIEWERS_REQUIRED) return { state: 'pending' as const, votes: votes.length };

    const keep = votes.filter(v => v.vote === 'keep').length;
    const accepted = keep > votes.length / 2;
    const [page] = await tx.select().from(pages).where(eq(pages.id, revision.pageId)).for('update');
    // The article moved on while this was in review. Accepting would erase those edits, so it closes unpaid.
    const stale = accepted && page!.currentRevisionId !== revision.parentId;
    const state = accepted && !stale ? 'accepted' : 'reverted';
    await tx.update(revisions).set({ state, closedAt: new Date() }).where(eq(revisions.id, revisionId));
    if (state === 'accepted') await tx.update(pages).set({ currentRevisionId: revisionId }).where(eq(pages.id, revision.pageId));
    if (revision.authorId && !stale) {
      if (state === 'accepted') await awardRep(tx, revision.authorId, 'edit_accepted', REP.editAccepted, `revision:${revisionId}`);
      else await awardRep(tx, revision.authorId, 'edit_reverted', REP.editReverted, `revision:${revisionId}`);
    }
    return { state, votes: votes.length, stale };
  });
}

export function getHistory(pageId: number) {
  return db
    .select({
      id: revisions.id,
      createdAt: revisions.createdAt,
      summary: revisions.summary,
      sizeDelta: revisions.sizeDelta,
      state: revisions.state,
      sourceKind: revisions.sourceKind,
      source: revisions.source,
      parentId: revisions.parentId,
      authorId: revisions.authorId,
      author: profiles.username,
      avatar: profiles.avatar,
      keep: sql<number>`(select count(*)::int from ${revisionVotes} where ${revisionVotes.revisionId} = ${revisions.id} and ${revisionVotes.vote} = 'keep')`,
      revert: sql<number>`(select count(*)::int from ${revisionVotes} where ${revisionVotes.revisionId} = ${revisions.id} and ${revisionVotes.vote} = 'revert')`,
    })
    .from(revisions)
    .leftJoin(profiles, eq(revisions.authorId, profiles.userId))
    .where(eq(revisions.pageId, pageId))
    .orderBy(desc(revisions.createdAt), desc(revisions.id));
}

export async function getRevisionBodies(id: number) {
  const [revision] = await db.select({ body: revisions.body, parentId: revisions.parentId }).from(revisions).where(eq(revisions.id, id));
  if (!revision) return null;
  const [parent] = revision.parentId ? await db.select({ body: revisions.body }).from(revisions).where(eq(revisions.id, revision.parentId)) : [];
  return { before: parent?.body ?? '', after: revision.body };
}

export const getMyReviewVote = async (revisionId: number, userId: string) => (await db.select({ vote: revisionVotes.vote }).from(revisionVotes).where(and(eq(revisionVotes.revisionId, revisionId), eq(revisionVotes.userId, userId))).orderBy(asc(revisionVotes.createdAt)))[0]?.vote ?? null;
