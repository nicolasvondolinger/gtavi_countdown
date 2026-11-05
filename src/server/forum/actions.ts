'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { requireViewer } from '@/server/auth/session';
import { createPost, createThread } from './service';

const thread = z.object({
  channelId: z.coerce.number().int().positive(),
  channelSlug: z.string(),
  title: z.string().trim().min(10, 'Use a title of at least 10 characters.').max(200),
  body: z.string().trim().min(10, 'Add some detail.').max(20_000),
});
const reply = z.object({
  threadId: z.coerce.number().int().positive(),
  parentId: z.coerce.number().int().positive().optional(),
  path: z.string().startsWith('/forums/'),
  body: z.string().trim().min(2, 'Write something first.').max(10_000),
});

export type ForumState = { error?: string; ok?: boolean };

export async function newThread(_: ForumState, form: FormData): Promise<ForumState> {
  const parsed = thread.safeParse(Object.fromEntries(form));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  const { channelSlug, ...values } = parsed.data;
  const viewer = await requireViewer(`/forums/${channelSlug}/new`);
  const created = await createThread({ ...values, authorId: viewer.user.id, spoiler: form.get('spoiler') === 'on', tagSlugs: form.getAll('tags').map(String) });
  revalidatePath(`/forums/${channelSlug}`);
  redirect(`/forums/${channelSlug}/${created.slug}`);
}

export async function postReply(_: ForumState, form: FormData): Promise<ForumState> {
  const parsed = reply.safeParse(Object.fromEntries([...form].filter(([, v]) => v !== '')));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  const { path, ...values } = parsed.data;
  const viewer = await requireViewer(path);
  await createPost({ ...values, authorId: viewer.user.id, spoiler: form.get('spoiler') === 'on' });
  revalidatePath(path);
  return { ok: true };
}
