import { asc, desc, eq } from 'drizzle-orm';
import { db, schema } from '@/server/db';

const { theories, comments, profiles } = schema;

export function getTheories(pageId: number) {
  return db
    .select({ id: theories.id, title: theories.title, body: theories.body, score: theories.score, plausible: theories.plausibleVotes, total: theories.totalVotes, createdAt: theories.createdAt, author: profiles.username })
    .from(theories)
    .leftJoin(profiles, eq(theories.authorId, profiles.userId))
    .where(eq(theories.pageId, pageId))
    .orderBy(desc(theories.score));
}

export type Discussion = { id: number; parentId: number | null; body: string; score: number; createdAt: Date; author: string | null; avatar: string | null; role: string | null; spoiler?: boolean; replies: Discussion[] };

export function nest(rows: Omit<Discussion, 'replies'>[]) {
  const byId = new Map<number, Discussion>(rows.map(r => [r.id, { ...r, replies: [] }]));
  const roots: Discussion[] = [];
  for (const node of byId.values()) {
    const parent = node.parentId ? byId.get(node.parentId) : undefined;
    if (parent) parent.replies.push(node);
    else roots.push(node);
  }
  return roots;
}

export async function getComments(pageId: number) {
  const rows = await db
    .select({ id: comments.id, parentId: comments.parentId, body: comments.body, score: comments.score, createdAt: comments.createdAt, author: profiles.username, avatar: profiles.avatar, role: profiles.role })
    .from(comments)
    .leftJoin(profiles, eq(comments.authorId, profiles.userId))
    .where(eq(comments.pageId, pageId))
    .orderBy(asc(comments.createdAt));
  return nest(rows);
}
