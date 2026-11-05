'use server';

import { revalidateLocales } from '@/server/revalidate';
import { requireViewer } from '@/server/auth/session';
import { markAllRead } from './notifications';

export async function readAll() {
  const viewer = await requireViewer('/notifications');
  await markAllRead(viewer.user.id);
  revalidateLocales('/notifications');
}
