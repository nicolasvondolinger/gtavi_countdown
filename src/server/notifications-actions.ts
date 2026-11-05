'use server';

import { revalidatePath } from 'next/cache';
import { requireViewer } from '@/server/auth/session';
import { markAllRead } from './notifications';

export async function readAll() {
  const viewer = await requireViewer('/notifications');
  await markAllRead(viewer.user.id);
  revalidatePath('/notifications');
}
