'use client';

import { useT } from '@/i18n/t';
import { useActionState } from 'react';
import { Avatar, AVATARS } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { completeOnboarding } from '@/server/account/actions';

export function OnboardingForm({ username, games, next }: { username: string; games: { id: number; name: string; year: number }[]; next: string }) {
  const t = useT();
  const [state, action, pending] = useActionState(completeOnboarding, {});
  return (
    <form action={action} className="flex flex-col gap-4">
      <input type="hidden" name="next" value={next} />
      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 text-sm font-semibold text-soft">{t('Avatar')}</legend>
        <div className="flex flex-wrap gap-3.5">
          {AVATARS.map((a, i) => (
            <label key={a} className="relative cursor-pointer">
              <input type="radio" name="avatar" value={a} defaultChecked={i === 0} aria-label={a.replace('_', ' ')} className="peer sr-only" />
              <span className="block rounded-control outline-offset-2 peer-checked:outline-2 peer-checked:outline-accent peer-focus-visible:outline-2 peer-focus-visible:outline-text">
                <Avatar avatar={a} size={72} />
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      <Field label={t('Gamertag')} name="username" defaultValue={username} required error={state.error} autoComplete="username" />
      <fieldset>
        <legend className="mb-2 text-sm font-semibold text-soft">{t('Favourite GTA')}</legend>
        <div className="grid gap-x-4 sm:grid-cols-2">
          {games.map((g, i) => (
            <label key={g.id} className="flex cursor-pointer items-center gap-2.5 border-t border-line py-2.5">
              <input type="radio" name="favorite" value={g.id} defaultChecked={i === 0} className="size-4 accent-accent" />
              <span className="flex-1 text-[15px] text-soft">{g.name}</span>
              <span className="font-data text-xs text-muted">{g.year}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <Button disabled={pending}>{t('Continue')}</Button>
    </form>
  );
}
