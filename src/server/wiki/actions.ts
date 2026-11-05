'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { requireViewer } from '@/server/auth/session';
import { ReviewError, castReviewVote, createRevision } from './review';

const edit = z.object({
  pageId: z.coerce.number().int().positive(),
  baseRevisionId: z.coerce.number().int().positive(),
  path: z.string().startsWith('/'),
  body: z.string().trim().min(1, 'The page can’t be empty.').max(100_000, 'That is too long for one page.'),
  summary: z.string().trim().min(3, 'Say what you changed.').max(200),
  sourceKind: z.enum(['official', 'community', 'none']),
  source: z.string().trim().max(500).optional(),
});

export type EditState = { error?: string };

export async function saveEdit(_: EditState, form: FormData): Promise<EditState> {
  const parsed = edit.safeParse(Object.fromEntries(form));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Check the form and try again.' };
  const { path, ...input } = parsed.data;
  const viewer = await requireViewer(`${path}/edit`);
  try {
    await createRevision({ ...input, authorId: viewer.user.id });
  } catch (e) {
    if (e instanceof ReviewError) return { error: e.message };
    throw e;
  }
  revalidatePath(path);
  redirect(`${path}/history`);
}

export async function voteOnEdit(form: FormData) {
  const path = String(form.get('path'));
  const viewer = await requireViewer(`${path}/history`);
  const vote = form.get('vote') === 'keep' ? 'keep' : 'revert';
  await castReviewVote(Number(form.get('revisionId')), viewer.user.id, vote);
  revalidatePath(path);
  revalidatePath(`${path}/history`);
}
