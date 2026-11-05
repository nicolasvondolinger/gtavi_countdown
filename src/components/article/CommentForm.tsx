'use client';

import { useActionState } from 'react';
import { Button } from '@/components/ui/Button';
import { postComment } from '@/server/wiki/community-actions';

export function CommentForm({ pageId, path, parentId }: { pageId: number; path: string; parentId?: number }) {
  const [state, action, pending] = useActionState(postComment, {});
  return (
    <form action={action} className="flex flex-col gap-2 rounded-control border border-line p-3">
      <input type="hidden" name="pageId" value={pageId} />
      <input type="hidden" name="path" value={path} />
      {parentId && <input type="hidden" name="parentId" value={parentId} />}
      <textarea key={state.ok ? 'sent' : 'draft'} name="body" required rows={2} aria-label={parentId ? 'Your reply' : 'Add to the talk page'} placeholder={parentId ? 'Your reply' : 'Add to the talk page. Cite a source for anything factual.'} className="bg-transparent font-read text-[15px] outline-none placeholder:text-dim" />
      {state.error && <p className="text-[13px] text-removed">{state.error}</p>}
      <div className="flex justify-end"><Button disabled={pending} className="px-3.5! py-1.5!">Post</Button></div>
    </form>
  );
}
