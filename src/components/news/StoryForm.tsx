'use client';

import { useActionState } from 'react';
import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { saveStory } from '@/server/news/actions';

type Story = { id: number; slug: string; gameId: number | null; title: string; excerpt: string; body: string; status: string | null; source: string; image: string | null; sponsored: boolean };

const select = 'rounded-control border border-control bg-bg px-3 py-2.5 text-[15px] font-normal text-text';

export function StoryForm({ games, story }: { games: { id: number; name: string }[]; story?: Story }) {
  const [state, action, pending] = useActionState(saveStory, {});
  return (
    <form action={action} className="flex flex-col gap-4">
      {story && <input type="hidden" name="id" value={story.id} />}
      {story && <input type="hidden" name="slug" value={story.slug} />}
      <Field label="Title" name="title" required defaultValue={story?.title} />
      <Field label="Summary" name="excerpt" required defaultValue={story?.excerpt} />
      <label className="flex flex-col gap-1.5 text-sm font-semibold text-soft">
        Story
        <textarea name="body" required rows={10} defaultValue={story?.body} className="rounded-control border border-control bg-bg p-3 font-read text-[15px] font-normal text-text" />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm font-semibold text-soft">
          Game
          <select name="gameId" defaultValue={story?.gameId ?? ''} className={select}>
            <option value="">The whole series</option>
            {games.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
          </select>
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-semibold text-soft">
          Verification
          <select name="status" defaultValue={story?.status ?? ''} className={select}>
            <option value="">None (sponsored or guides)</option>
            <option value="official">Official</option>
            <option value="leak">Unverified leak</option>
            <option value="theory">Community theory</option>
          </select>
        </label>
      </div>
      <Field label="Source" name="source" required defaultValue={story?.source} />
      <Field label="Image" name="image" defaultValue={story?.image ?? ''} help="A path inside public/media, such as bg/hero.webp." />
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="sponsored" defaultChecked={story?.sponsored} className="size-4 accent-accent" />Sponsored placement</label>
      {state.error && <p role="alert" className="text-sm text-removed">{state.error}</p>}
      <div><Button disabled={pending}>{story ? 'Save story' : 'Publish story'}</Button></div>
    </form>
  );
}
