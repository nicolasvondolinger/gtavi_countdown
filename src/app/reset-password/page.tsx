import type { Metadata } from 'next';
import Link from 'next/link';
import { AuthScreen } from '@/components/auth/AuthCard';
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';

export const metadata: Metadata = { title: 'Set a new password', robots: { index: false } };

export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ token?: string; error?: string }> }) {
  const { token, error } = await searchParams;
  return (
    <AuthScreen>
      <div className="flex flex-col gap-4">
        <h1 className="text-[33px]">Set a new password</h1>
        {token && !error ? <ResetPasswordForm token={token} /> : <p className="font-read text-[15px] text-body">This link has expired. <Link href="/forgot-password" className="font-semibold text-accent">Ask for a new one</Link>.</p>}
      </div>
    </AuthScreen>
  );
}
