'use client';

import { useT } from '@/i18n/t';
import { useActionState } from 'react';
import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { changeRole } from '@/server/moderation/actions';

export function RoleForm() {
  const t = useT();
  const [state, action, pending] = useActionState(changeRole, {});
  return (
    <form action={action} className="flex flex-wrap items-end gap-3">
      <Field label={t('Username')} name="username" required />
      <label className="flex flex-col gap-1.5 text-sm font-semibold text-soft">
        {t('Role')}
        <select name="role" defaultValue="reviewer" className="rounded-control border border-control bg-bg px-3 py-2.5 text-[15px] font-normal text-text">
          <option value="member">{t('Member')}</option>
          <option value="reviewer">{t('Reviewer')}</option>
          <option value="moderator">{t('Moderator')}</option>
        </select>
      </label>
      <Button disabled={pending}>{t('Set role')}</Button>
      {state.message && <p role="status" className="w-full text-sm text-muted">{state.message}</p>}
    </form>
  );
}
