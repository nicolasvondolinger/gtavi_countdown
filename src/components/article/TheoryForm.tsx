'use client';

import { useT } from '@/i18n/t';
import { useActionState } from 'react';
import { Button } from '@/components/ui/Button';
import { proposeTheory } from '@/server/wiki/community-actions';

export function TheoryForm({ pageId, path }: { pageId: number; path: string }) {
  const t = useT();
  const [state, action, pending] = useActionState(proposeTheory, {});
  return (
    <details className="border-t border-line pt-3">
      <summary className="cursor-pointer text-sm font-semibold text-accent">{t('Propose a theory')}</summary>
      <form action={action} className="mt-3 flex flex-col gap-2.5">
        <input type="hidden" name="pageId" value={pageId} />
        <input type="hidden" name="path" value={path} />
        <input name="title" aria-label={t('Theory title')} placeholder={t('The theory, in one line')} required className="rounded-control border border-control bg-bg px-3 py-2.5 text-[15px] placeholder:text-dim" />
        <textarea name="body" aria-label={t('Your reasoning')} placeholder={t('Your reasoning')} required rows={3} className="rounded-control border border-control bg-bg px-3 py-2.5 font-read text-[15px] placeholder:text-dim" />
        {state.error && <p className="text-[13px] text-removed">{state.error}</p>}
        <div><Button disabled={pending} className="py-2!">{t('Propose')}</Button></div>
      </form>
    </details>
  );
}
