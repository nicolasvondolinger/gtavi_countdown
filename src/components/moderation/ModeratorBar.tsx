'use client';

import { useViewer } from '@/components/layout/useViewer';
import { Button } from '@/components/ui/Button';
import { togglePin } from '@/server/moderation/actions';

// Threads are cached pages, so this control appears from the browser.
export function ModeratorBar({ threadId, pinned, path }: { threadId: number; pinned: boolean; path: string }) {
  const viewer = useViewer();
  if (viewer?.role !== 'moderator') return null;
  return (
    <form action={togglePin}>
      <input type="hidden" name="threadId" value={threadId} />
      <input type="hidden" name="pinned" value={String(!pinned)} />
      <input type="hidden" name="path" value={path} />
      <Button kind="secondary" className="px-3! py-1.5! text-sm!">{pinned ? 'Unpin thread' : 'Pin thread'}</Button>
    </form>
  );
}
