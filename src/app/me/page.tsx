import { redirect } from 'next/navigation';
import { getViewer } from '@/server/auth/session';

export default async function MePage() {
  const viewer = await getViewer();
  redirect(viewer ? `/u/${viewer.profile.username}` : '/signin?next=/me');
}
