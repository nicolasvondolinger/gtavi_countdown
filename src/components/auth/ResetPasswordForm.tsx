'use client';

import { useT } from '@/i18n/t';
import { useRouter } from '@/i18n/navigation';
import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { authClient } from '@/server/auth/client';

export function ResetPasswordForm({ token }: { token: string }) {
  const t = useT();
  const router = useRouter();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    const { error: failed } = await authClient.resetPassword({ newPassword: String(new FormData(e.currentTarget).get('password')), token });
    setBusy(false);
    if (failed) return setError('This link has expired or was already used. Ask for a new one.');
    router.push('/signin');
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <Field label={t('New password')} name="password" type="password" autoComplete="new-password" required minLength={12} help={t('At least 12 characters.')} error={error} />
      <Button disabled={busy} className="py-3">{t('Set new password')}</Button>
    </form>
  );
}
