import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { AuthScreen, AuthTabs } from '@/components/auth/AuthCard';
import { OAuthButtons } from '@/components/auth/OAuthButtons';
import { SignUpForm } from '@/components/auth/SignUpForm';
import { Wordmark } from '@/components/layout/Wordmark';
import { safeNext } from '@/lib/account';
import { enabledProviders } from '@/server/auth';
import { getViewer } from '@/server/auth/session';

export const metadata: Metadata = { title: 'Create account', robots: { index: false } };

export default async function SignUpPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const next = safeNext((await searchParams).next);
  if (await getViewer()) redirect(next);
  return (
    <AuthScreen>
      <div className="flex flex-col gap-4.5">
        <div><Wordmark size={18} /></div>
        <h1 className="sr-only">Create account</h1>
        <AuthTabs active="signup" next={next} />
        <OAuthButtons enabled={enabledProviders} next={next} />
        <SignUpForm next={next} />
      </div>
    </AuthScreen>
  );
}
