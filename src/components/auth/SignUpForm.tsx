'use client';

import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { USERNAME } from '@/lib/account';
import { authClient } from '@/server/auth/client';
import { recordConsent } from '@/server/account/actions';

export function SignUpForm({ next }: { next: string }) {
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const username = String(data.get('username'));
    if (!USERNAME.test(username)) return setErrors({ username: 'Use 3 to 20 letters, numbers or underscores.' });
    setBusy(true);
    setErrors({});
    const check = (await (await fetch(`/api/username?u=${encodeURIComponent(username)}`)).json()) as { available: boolean; reason: string | null };
    if (!check.available) {
      setBusy(false);
      return setErrors({ username: check.reason ?? 'That username is taken.' });
    }
    const { error } = await authClient.signUp.email({ name: username, email: String(data.get('email')), password: String(data.get('password')) });
    if (error) {
      setBusy(false);
      return setErrors(error.status === 429 ? { form: 'Too many attempts. Wait a minute and try again.' } : error.code?.includes('PASSWORD') ? { password: 'Use at least 12 characters.' } : { email: 'An account with this email already exists.' });
    }
    await recordConsent(data.get('marketing') === 'on');
    router.push(`/onboarding?next=${encodeURIComponent(next)}`);
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <Field label="Email" name="email" type="email" autoComplete="email" required error={errors.email} />
      <Field label="Username" name="username" autoComplete="username" required error={errors.username} />
      <Field label="Password" name="password" type="password" autoComplete="new-password" required minLength={12} error={errors.password} help="At least 12 characters." />
      <label className="flex items-start gap-2.5 font-read text-sm/snug text-body">
        <input type="checkbox" name="terms" required className="mt-0.5 size-[18px] accent-accent" />
        I agree to the Terms of Service and the Privacy Policy.
      </label>
      <label className="flex items-start gap-2.5 font-read text-sm/snug text-body">
        <input type="checkbox" name="marketing" className="mt-0.5 size-[18px] accent-accent" />
        Email me when GTA VI launches and once a week after that.
      </label>
      {errors.form && <p className="text-[13px] text-removed">{errors.form}</p>}
      <Button disabled={busy} className="py-3">Create account</Button>
    </form>
  );
}
