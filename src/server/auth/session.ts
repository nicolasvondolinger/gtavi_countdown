import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { cache } from 'react';
import { db, schema } from '@/server/db';
import { auth } from './index';

export const getViewer = cache(async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;
  const [profile] = await db.select().from(schema.profiles).where(eq(schema.profiles.userId, session.user.id)).limit(1);
  return profile ? { user: session.user, profile } : null;
});

export type Viewer = NonNullable<Awaited<ReturnType<typeof getViewer>>>;

// For pages: sends visitors to sign in and brings them back.
export async function requireViewer(next: string) {
  const viewer = await getViewer();
  if (!viewer) redirect(`/signin?next=${encodeURIComponent(next)}`);
  if (!viewer.profile.onboardedAt) redirect(`/onboarding?next=${encodeURIComponent(next)}`);
  return viewer;
}
