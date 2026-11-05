'use client';

import { useT } from '@/i18n/t';
import { useActionState } from 'react';
import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { saveStory } from '@/server/news/actions';

type Story = { i18n: { pt?: { title?: string; excerpt?: string; body?: string } }; id: number; slug: string; gameId: number | null; title: string; excerpt: string; body: string; status: string | null; source: string; image: string | null; sponsored: boolean };

const select = 'rounded-control border border-control bg-bg px-3 py-2.5 text-[15px] font-normal text-text';

export function StoryForm({ games, story }: { games: { id: number; name: string }[]; story?: Story }) {
  const t = useT();
  const [state, action, pending] = useActionState(saveStory, {});
  return (
    <form action={action} className="flex flex-col gap-4">
      {story && <input type="hidden" name="id" value={story.id} />}
      {story && <input type="hidden" name="slug" value={story.slug} />}
      <Field label={t('Title')} name="title" required defaultValue={story?.title} />
      <Field label={t('Summary')} name="excerpt" required defaultValue={story?.excerpt} />
      <label className="flex flex-col gap-1.5 text-sm font-semibold text-soft">
        {t('Story')}
        <textarea name="body" required rows={10} defaultValue={story?.body} className="rounded-control border border-control bg-bg p-3 font-read text-[15px] font-normal text-text" />
      </label>
      <details open={!!story?.i18n.pt?.title} className="flex flex-col gap-4 rounded-panel border border-line p-3">
        <summary className="cursor-pointer text-sm font-semibold text-soft">{t('Portuguese version')}</summary>
        <div className="mt-3 flex flex-col gap-4">
          <Field label={t('Title in Portuguese')} name="ptTitle" defaultValue={story?.i18n.pt?.title} />
          <Field label={t('Summary in Portuguese')} name="ptExcerpt" defaultValue={story?.i18n.pt?.excerpt} />
          <label className="flex flex-col gap-1.5 text-sm font-semibold text-soft">
            {t('Story in Portuguese')}
            <textarea name="ptBody" rows={6} defaultValue={story?.i18n.pt?.body} className="rounded-control border border-control bg-bg p-3 font-read text-[15px] font-normal text-text" />
          </label>
        </div>
      </details>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm font-semibold text-soft">
          {t('Game')}
          <select name="gameId" defaultValue={story?.gameId ?? ''} className={select}>
            <option value="">{t('The whole series')}</option>
            {games.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
          </select>
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-semibold text-soft">
          {t('Verification')}
          <select name="status" defaultValue={story?.status ?? ''} className={select}>
            <option value="">{t('None (sponsored or guides)')}</option>
            <option value="official">{t('Official')}</option>
            <option value="leak">{t('Unverified leak')}</option>
            <option value="theory">{t('Community theory')}</option>
          </select>
        </label>
      </div>
      <Field label={t('Source')} name="source" required defaultValue={story?.source} />
      <Field label={t('Image')} name="image" defaultValue={story?.image ?? ''} help={t('A path inside public/media, such as art/key-01.webp.')} />
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="sponsored" defaultChecked={story?.sponsored} className="size-4 accent-accent" />{t('Sponsored placement')}</label>
      {state.error && <p role="alert" className="text-sm text-removed">{state.error}</p>}
      <div><Button disabled={pending}>{story ? t('Save story') : t('Publish story')}</Button></div>
    </form>
  );
}
