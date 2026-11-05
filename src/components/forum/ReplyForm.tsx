'use client';

import { useT } from '@/i18n/t';
import { useActionState } from 'react';
import { Button } from '@/components/ui/Button';
import { postReply } from '@/server/forum/actions';

export function ReplyForm({ threadId, parentId, path }: { threadId: number; parentId?: number; path: string }) {
  const t = useT();
  const [state, action, pending] = useActionState(postReply, {});
  return (
    <form action={action} className="flex flex-col gap-2 rounded-control border border-line p-3">
      <input type="hidden" name="threadId" value={threadId} />
      <input type="hidden" name="path" value={path} />
      {parentId && <input type="hidden" name="parentId" value={parentId} />}
      <textarea key={state.ok ? 'sent' : 'draft'} name="body" required rows={2} aria-label={t('Your reply')} placeholder={t('Reply to the thread')} className="bg-transparent font-read text-[15px] outline-none placeholder:text-dim" />
      {state.error && <p className="text-[13px] text-removed">{state.error}</p>}
      <div className="flex items-center justify-end gap-3">
        <label className="flex items-center gap-1.5 text-sm text-muted"><input type="checkbox" name="spoiler" className="size-4 accent-accent" />{t('Spoiler')}</label>
        <Button disabled={pending} className="px-3.5! py-1.5!">{t('Reply')}</Button>
      </div>
    </form>
  );
}
