import { NextResponse } from 'next/server';
import { levelFor } from '@/lib/account';
import { getViewer } from '@/server/auth/session';
import { unreadCount } from '@/server/notifications';
import { canReview, pendingCount } from '@/server/wiki/review';

export async function GET() {
  const viewer = await getViewer();
  if (!viewer) return NextResponse.json(null, { headers: { 'Cache-Control': 'private, no-store' } });
  const { username, avatar, rep, role, onboardedAt } = viewer.profile;
  const reviewer = canReview(viewer.profile);
  const [unread, pending] = await Promise.all([unreadCount(viewer.user.id), reviewer ? pendingCount() : 0]);
  return NextResponse.json({ username, avatar, rep, role, level: levelFor(rep), onboarded: !!onboardedAt, unread, reviewer, pending }, { headers: { 'Cache-Control': 'private, no-store' } });
}
