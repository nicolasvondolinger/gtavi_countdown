'use server';

import { existsSync } from 'node:fs';
import path from 'node:path';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { requireViewer } from '@/server/auth/session';
import { createStory, updateStory } from './service';

const story = z.object({
  id: z.coerce.number().int().positive().optional(),
  gameId: z.coerce.number().int().positive().optional(),
  title: z.string().trim().min(10, 'Use a title of at least 10 characters.').max(200),
  excerpt: z.string().trim().min(10, 'Add a short summary.').max(300),
  body: z.string().trim().min(10, 'Write the story.').max(50_000),
  status: z.enum(['official', 'leak', 'theory']).optional(),
  source: z.string().trim().min(2, 'Every story names its source.').max(200),
  image: z.string().trim().regex(/^[\w/-]+\.(webp|png|jpe?g)$/, 'Use a path inside public/media.').optional(),
});

export type StoryState = { error?: string };

export async function saveStory(_: StoryState, form: FormData): Promise<StoryState> {
  const viewer = await requireViewer('/news/new');
  if (viewer.profile.role !== 'moderator') redirect('/news');
  const parsed = story.safeParse(Object.fromEntries([...form].filter(([, v]) => v !== '')));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  const { id, gameId, status, image, ...rest } = parsed.data;
  const sponsored = form.get('sponsored') === 'on';
  if (!sponsored && !status) return { error: 'Pick a verification status.' };
  if (image && !existsSync(path.join(process.cwd(), 'public', 'media', image))) return { error: 'That image is not in public/media.' };
  const input = { ...rest, gameId: gameId ?? null, status: sponsored ? null : (status ?? null), image: image ?? null, sponsored };
  let slug = String(form.get('slug') ?? '');
  if (id) await updateStory(id, input);
  else slug = (await createStory(input)).slug;
  revalidatePath('/news');
  revalidatePath('/');
  revalidatePath(`/news/${slug}`);
  redirect(sponsored ? '/news' : `/news/${slug}`);
}
