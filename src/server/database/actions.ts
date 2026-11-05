'use server';

import { randomBytes } from 'node:crypto';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { getViewer } from '@/server/auth/session';
import { db, schema } from '@/server/db';
import { validateChoices } from './queries';

const input = z.object({ vehicleId: z.number().int().positive(), name: z.string().trim().min(2, 'Give the build a name.').max(80), choices: z.record(z.string(), z.number().int().positive()) });

export async function saveBuild(raw: { vehicleId: number; name: string; choices: Record<string, number> }, next: string) {
  const viewer = await getViewer();
  if (!viewer) redirect(`/signin?next=${encodeURIComponent(next)}`);
  const parsed = input.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Check the build and try again.' };
  if (!(await validateChoices(parsed.data.choices))) return { error: 'One of those mods is not available.' };
  const code = randomBytes(4).toString('hex');
  await db.insert(schema.builds).values({ ...parsed.data, code, authorId: viewer.user.id });
  redirect(`/b/${code}`);
}
