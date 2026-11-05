import { and, eq, sql } from 'drizzle-orm';
import { db, schema } from '@/server/db';

const { theories, theoryVotes, comments, commentVotes, threads, threadVotes, posts, postVotes } = schema;

export type VoteKind = 'theory' | 'comment' | 'thread' | 'post';

const TABLES = {
  theory: { target: theories, votes: theoryVotes, key: theoryVotes.theoryId, column: 'theoryId' },
  comment: { target: comments, votes: commentVotes, key: commentVotes.commentId, column: 'commentId' },
  thread: { target: threads, votes: threadVotes, key: threadVotes.threadId, column: 'threadId' },
  post: { target: posts, votes: postVotes, key: postVotes.postId, column: 'postId' },
} as const;

// One vote per person. Voting the same way again takes the vote back.
export async function vote(kind: VoteKind, id: number, userId: string, value: 1 | -1) {
  const t = TABLES[kind];
  return db.transaction(async tx => {
    const [existing] = await tx.select({ value: t.votes.value }).from(t.votes).where(and(eq(t.key, id), eq(t.votes.userId, userId))).for('update');
    const previous = existing?.value ?? 0;
    const next = previous === value ? 0 : value;
    if (next === 0) await tx.delete(t.votes).where(and(eq(t.key, id), eq(t.votes.userId, userId)));
    else if (existing) await tx.update(t.votes).set({ value: next }).where(and(eq(t.key, id), eq(t.votes.userId, userId)));
    else await tx.insert(t.votes).values({ [t.column]: id, userId, value: next } as never);

    const delta = next - previous;
    const extra = kind === 'theory'
      ? { plausibleVotes: sql`${theories.plausibleVotes} + ${(next === 1 ? 1 : 0) - (previous === 1 ? 1 : 0)}`, totalVotes: sql`${theories.totalVotes} + ${(next ? 1 : 0) - (previous ? 1 : 0)}` }
      : {};
    const [row] = await tx
      .update(t.target as typeof theories)
      .set({ score: sql`score + ${delta}`, ...extra })
      .where(eq((t.target as typeof theories).id, id))
      .returning({ score: (t.target as typeof theories).score });
    return { score: row?.score ?? 0, mine: next };
  });
}

export async function myVotes(userId: string, ids: Partial<Record<VoteKind, number[]>>) {
  const out: Record<string, number> = {};
  for (const kind of Object.keys(ids) as VoteKind[]) {
    const list = ids[kind];
    if (!list?.length) continue;
    const t = TABLES[kind];
    const rows = await db.select({ id: t.key, value: t.votes.value }).from(t.votes).where(and(eq(t.votes.userId, userId), sql`${t.key} = ANY(${sql.param(list)}::int[])`));
    for (const r of rows) out[`${kind}:${r.id}`] = r.value;
  }
  return out;
}
