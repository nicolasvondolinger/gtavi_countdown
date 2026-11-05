'use client';

import { useT } from '@/i18n/t';
import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { authClient } from '@/server/auth/client';

export function ForgotPasswordForm() {
  const t = useT();
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    await authClient.requestPasswordReset({ email: String(new FormData(e.currentTarget).get('email')), redirectTo: '/reset-password' });
    setBusy(false);
    setSent(true);
  }

  // The same message either way, so this form cannot reveal who has an account.
  if (sent) return <p role="status" className="font-read text-[15px]/[1.6] text-body">{t('If that email has an account, a reset link is on its way.')}</p>;
  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <Field label={t('Email')} name="email" type="email" autoComplete="email" required />
      <Button disabled={busy} className="py-3">{t('Send reset link')}</Button>
    </form>
  );
}
