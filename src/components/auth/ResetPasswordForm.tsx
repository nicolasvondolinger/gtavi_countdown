'use client';

import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { authClient } from '@/server/auth/client';

export function ResetPasswordForm({ token }: { token: string }) {
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
      <Field label="New password" name="password" type="password" autoComplete="new-password" required minLength={12} help="At least 12 characters." error={error} />
      <Button disabled={busy} className="py-3">Set new password</Button>
    </form>
  );
}
