'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { requireViewer } from '@/server/auth/session';
import { report, resolveReport, setPinned, setRole } from './service';

async function requireModerator(next: string) {
  const viewer = await requireViewer(next);
  if (viewer.profile.role !== 'moderator') redirect('/');
  return viewer;
}

const target = z.object({ kind: z.enum(['comment', 'post']), id: z.coerce.number().int().positive(), path: z.string().startsWith('/') });

export async function reportContent(form: FormData) {
  const { kind, id, path } = target.parse(Object.fromEntries(form));
  const viewer = await requireViewer(path);
  await report(kind, id, viewer.user.id);
}

export async function resolve(form: FormData) {
  const viewer = await requireModerator('/moderation');
  const { kind, id, path } = target.parse(Object.fromEntries([...form].filter(([k]) => k !== 'action')));
  await resolveReport(kind, id, viewer.user.id, form.get('action') === 'remove' ? 'remove' : 'dismiss');
  revalidatePath('/moderation');
  revalidatePath(path.split('#')[0]!);
}

export async function togglePin(form: FormData) {
  const path = z.string().startsWith('/forums/').parse(form.get('path'));
  const viewer = await requireModerator(path);
  await setPinned(Number(form.get('threadId')), form.get('pinned') === 'true', viewer.user.id);
  revalidatePath(path);
  revalidatePath(path.split('/').slice(0, 3).join('/'));
}

export type RoleState = { message?: string };

export async function changeRole(_: RoleState, form: FormData): Promise<RoleState> {
  const viewer = await requireModerator('/moderation');
  const parsed = z.object({ username: z.string().trim().min(3), role: z.enum(['member', 'reviewer', 'moderator']) }).safeParse(Object.fromEntries(form));
  if (!parsed.success) return { message: 'Enter a username.' };
  const done = await setRole(parsed.data.username, parsed.data.role, viewer.user.id);
  return { message: done ? `${parsed.data.username} is now ${parsed.data.role}.` : 'No member has that username.' };
}
