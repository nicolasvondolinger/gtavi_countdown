import { NextResponse } from 'next/server';
import { levelFor } from '@/lib/account';
import { getViewer } from '@/server/auth/session';

export async function GET() {
  const viewer = await getViewer();
  const body = viewer ? { username: viewer.profile.username, avatar: viewer.profile.avatar, rep: viewer.profile.rep, level: levelFor(viewer.profile.rep), onboarded: !!viewer.profile.onboardedAt } : null;
  return NextResponse.json(body, { headers: { 'Cache-Control': 'private, no-store' } });
}
