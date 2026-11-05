import { localizedMeta } from '@/i18n/page';
import { getT } from '@/i18n/server';
import { Link } from '@/i18n/navigation';
import { AuthScreen } from '@/components/auth/AuthCard';
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';

export const generateMetadata = localizedMeta({ title: 'Set a new password', robots: { index: false } });

export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ token?: string; error?: string }> }) {
  const t = await getT();
  const { token, error } = await searchParams;
  return (
    <AuthScreen>
      <div className="flex flex-col gap-4">
        <h1 className="text-[33px]">{t('Set a new password')}</h1>
        {token && !error ? <ResetPasswordForm token={token} /> : <p className="font-read text-[15px] text-body">{t('This link has expired.')}{' '}<Link href="/forgot-password" className="font-semibold text-accent">{t('Ask for a new one')}</Link>.</p>}
      </div>
    </AuthScreen>
  );
}
