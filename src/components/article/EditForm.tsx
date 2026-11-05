'use client';

import { useActionState, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Status } from '@/components/ui/Status';
import { saveEdit } from '@/server/wiki/actions';

const KINDS = [
  ['official', 'Official source', 'A link to Rockstar, Take-Two, PlayStation, Xbox or the ESRB. Published right away.'],
  ['community', 'Community source', 'A forum thread, video or other source. Five reviewers decide; if accepted it shows as an unverified leak.'],
  ['none', 'No source', 'Fine for typos and tidying. Five reviewers decide.'],
] as const;

export function EditForm({ pageId, baseRevisionId, path, body }: { pageId: number; baseRevisionId: number; path: string; body: string }) {
  const [state, action, pending] = useActionState(saveEdit, {});
  const [kind, setKind] = useState<(typeof KINDS)[number][0]>('none');
  return (
    <form action={action} className="flex flex-col gap-4">
      <input type="hidden" name="pageId" value={pageId} />
      <input type="hidden" name="baseRevisionId" value={baseRevisionId} />
      <input type="hidden" name="path" value={path} />
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-semibold text-soft">Page text (Markdown)</span>
        <textarea name="body" defaultValue={body} required rows={20} className="rounded-control border border-control bg-bg p-3 font-data text-[13px]/[1.6] text-text" />
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-semibold text-soft">What did you change?</span>
        <input name="summary" required maxLength={200} className="rounded-control border border-control bg-bg px-3 py-2.5 text-[15px]" />
      </label>
      <fieldset className="flex flex-col gap-2">
        <legend className="mb-1 text-sm font-semibold text-soft">Source</legend>
        {KINDS.map(([value, label, help]) => (
          <label key={value} className="flex cursor-pointer items-start gap-2.5 border-t border-line py-2.5">
            <input type="radio" name="sourceKind" value={value} checked={kind === value} onChange={() => setKind(value)} className="mt-1 size-4 accent-accent" />
            <span className="flex flex-col gap-0.5">
              <span className="text-[15px] font-semibold">{label}</span>
              <span className="font-read text-[13px] text-muted">{help}</span>
            </span>
          </label>
        ))}
        {kind !== 'none' && (
          <input name="source" required aria-label="Source" placeholder={kind === 'official' ? 'https://www.rockstargames.com/…' : 'Where this comes from'} className="rounded-control border border-control bg-bg px-3 py-2.5 text-[15px] placeholder:text-dim" />
        )}
      </fieldset>
      {kind === 'community' && <Status kind="leak" source="if accepted" />}
      {state.error && <p role="alert" className="text-sm text-removed">{state.error}</p>}
      <div><Button disabled={pending}>{kind === 'official' ? 'Publish edit' : 'Send for review'}</Button></div>
    </form>
  );
}
