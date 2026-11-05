'use server';

import { eq, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { AVATARS } from '@/components/ui/Avatar';
import { USERNAME, safeNext } from '@/lib/account';
import { auth } from '@/server/auth';
import { getViewer } from '@/server/auth/session';
import { db, schema } from '@/server/db';
import { headers } from 'next/headers';

export async function recordConsent(marketing: boolean) {
  const viewer = await getViewer();
  if (!viewer) return;
  await db.update(schema.profiles).set({ termsAcceptedAt: new Date(), marketingOptIn: marketing }).where(eq(schema.profiles.userId, viewer.user.id));
}

const onboarding = z.object({
  username: z.string().regex(USERNAME, 'Use 3 to 20 letters, numbers or underscores.'),
  avatar: z.enum(AVATARS),
  favorite: z.coerce.number().int().positive().optional(),
  next: z.string().optional(),
});

export type OnboardingState = { error?: string };

export async function completeOnboarding(_: OnboardingState, form: FormData): Promise<OnboardingState> {
  const viewer = await getViewer();
  if (!viewer) redirect('/signin');
  const parsed = onboarding.safeParse({ username: form.get('username'), avatar: form.get('avatar'), favorite: form.get('favorite') || undefined, next: form.get('next') ?? undefined });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Check the form and try again.' };
  const { username, avatar, favorite, next } = parsed.data;
  const clash = await db.$count(schema.profiles, sql`lower(${schema.profiles.username}) = ${username.toLowerCase()} AND ${schema.profiles.userId} <> ${viewer.user.id}`);
  if (clash) return { error: 'That username is taken.' };
  await db.update(schema.profiles).set({ username, avatar, favoriteGameId: favorite, onboardedAt: new Date() }).where(eq(schema.profiles.userId, viewer.user.id));
  redirect(safeNext(next));
}

export async function signOut() {
  await auth.api.signOut({ headers: await headers() });
  revalidatePath('/', 'layout');
  redirect('/');
}
