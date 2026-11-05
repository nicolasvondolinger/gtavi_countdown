'use server';

import { eq, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { requireViewer } from '@/server/auth/session';
import { db, schema } from '@/server/db';

const comment = z.object({
  pageId: z.coerce.number().int().positive(),
  parentId: z.coerce.number().int().positive().optional(),
  path: z.string().startsWith('/'),
  body: z.string().trim().min(2, 'Write something first.').max(5000),
});
const theory = z.object({
  pageId: z.coerce.number().int().positive(),
  path: z.string().startsWith('/'),
  title: z.string().trim().min(10, 'Give the theory a clear title.').max(200),
  body: z.string().trim().min(10, 'Explain the reasoning.').max(5000),
});

export type FormState = { error?: string; ok?: boolean };
const entries = (form: FormData) => Object.fromEntries([...form].filter(([, v]) => v !== ''));

export async function postComment(_: FormState, form: FormData): Promise<FormState> {
  const parsed = comment.safeParse(entries(form));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  const { path, ...values } = parsed.data;
  const viewer = await requireViewer(`${path}#talk`);
  await db.insert(schema.comments).values({ ...values, authorId: viewer.user.id });
  revalidatePath(path);
  return { ok: true };
}

export async function reportComment(form: FormData) {
  const path = String(form.get('path'));
  await requireViewer(path);
  await db
    .update(schema.comments)
    .set({ reports: sql`${schema.comments.reports} + 1` })
    .where(eq(schema.comments.id, Number(form.get('id'))));
}

export async function proposeTheory(_: FormState, form: FormData): Promise<FormState> {
  const parsed = theory.safeParse(entries(form));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  const { path, ...values } = parsed.data;
  const viewer = await requireViewer(`${path}#theories`);
  await db.insert(schema.theories).values({ ...values, authorId: viewer.user.id });
  revalidatePath(path);
  return { ok: true };
}
