'use server';

import { z } from 'zod';
import { getViewer } from '@/server/auth/session';
import { myVotes, vote, type VoteKind } from './votes';

const input = z.object({ kind: z.enum(['theory', 'comment', 'thread', 'post']), id: z.number().int().positive(), value: z.union([z.literal(1), z.literal(-1)]) });

export async function castVote(raw: { kind: VoteKind; id: number; value: 1 | -1 }) {
  const { kind, id, value } = input.parse(raw);
  const viewer = await getViewer();
  if (!viewer) return { signedOut: true as const };
  return vote(kind, id, viewer.user.id, value);
}

export async function loadMyVotes(ids: Partial<Record<VoteKind, number[]>>) {
  const viewer = await getViewer();
  return viewer ? myVotes(viewer.user.id, ids) : {};
}
