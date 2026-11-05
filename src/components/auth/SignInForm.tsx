'use client';

import { useT } from '@/i18n/t';
import { Link } from '@/i18n/navigation';
import { useRouter } from '@/i18n/navigation';
import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { authClient } from '@/server/auth/client';

export function SignInForm({ next }: { next: string }) {
  const t = useT();
  const router = useRouter();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setBusy(true);
    setError('');
    const { error: failed } = await authClient.signIn.email({ email: String(data.get('email')), password: String(data.get('password')) });
    setBusy(false);
    if (failed) return setError(failed.status === 429 ? 'Too many attempts. Wait a minute and try again.' : 'That email and password don’t match.');
    router.push(`/onboarding?next=${encodeURIComponent(next)}`);
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <Field label={t('Email')} name="email" type="email" autoComplete="email" required />
      <Field label={t('Password')} name="password" type="password" autoComplete="current-password" required error={error} aside={<Link href="/forgot-password" className="text-[13px] font-semibold text-accent">{t('Forgot password?')}</Link>} />
      <Button disabled={busy} className="py-3">{t('Sign in')}</Button>
    </form>
  );
}
