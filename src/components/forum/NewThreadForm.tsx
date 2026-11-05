'use client';

import { useT } from '@/i18n/t';
import { useActionState } from 'react';
import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { newThread } from '@/server/forum/actions';

export function NewThreadForm({ channelId, channelSlug, tags }: { channelId: number; channelSlug: string; tags: string[] }) {
  const t = useT();
  const [state, action, pending] = useActionState(newThread, {});
  return (
    <form action={action} className="flex flex-col gap-4">
      <input type="hidden" name="channelId" value={channelId} />
      <input type="hidden" name="channelSlug" value={channelSlug} />
      <Field label={t('Title')} name="title" required maxLength={200} />
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-semibold text-soft">{t('Post')}</span>
        <textarea name="body" required rows={8} className="rounded-control border border-control bg-bg p-3 font-read text-[15px]" />
      </label>
      <fieldset className="flex flex-wrap items-center gap-3">
        <legend className="mb-2 text-sm font-semibold text-soft">{t('Tags')}</legend>
        {tags.map(t => <label key={t} className="flex items-center gap-1.5 text-sm"><input type="checkbox" name="tags" value={t} className="size-4 accent-accent" />{t}</label>)}
      </fieldset>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="spoiler" className="size-4 accent-accent" />{t('This thread contains spoilers')}</label>
      {state.error && <p role="alert" className="text-sm text-removed">{state.error}</p>}
      <div><Button disabled={pending}>{t('Post thread')}</Button></div>
    </form>
  );
}
