import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { AuthScreen, AuthTabs } from '@/components/auth/AuthCard';
import { OAuthButtons } from '@/components/auth/OAuthButtons';
import { SignInForm } from '@/components/auth/SignInForm';
import { Wordmark } from '@/components/layout/Wordmark';
import { safeNext } from '@/lib/account';
import { enabledProviders } from '@/server/auth';
import { getViewer } from '@/server/auth/session';

export const metadata: Metadata = { title: 'Sign in', robots: { index: false } };

export default async function SignInPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const next = safeNext((await searchParams).next);
  if (await getViewer()) redirect(next);
  return (
    <AuthScreen>
      <div className="flex flex-col gap-4.5">
        <div><Wordmark size={18} /></div>
        <h1 className="sr-only">Sign in</h1>
        <AuthTabs active="signin" next={next} />
        <OAuthButtons enabled={enabledProviders} next={next} />
        <SignInForm next={next} />
      </div>
    </AuthScreen>
  );
}
