'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { authClient } from '@/server/auth/client';

export function SignInForm({ next }: { next: string }) {
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
      <Field label="Email" name="email" type="email" autoComplete="email" required />
      <Field label="Password" name="password" type="password" autoComplete="current-password" required error={error} aside={<Link href="/forgot-password" className="text-[13px] font-semibold text-accent">Forgot password?</Link>} />
      <Button disabled={busy} className="py-3">Sign in</Button>
    </form>
  );
}
