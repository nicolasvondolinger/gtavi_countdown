import { localizedMeta } from '@/i18n/page';
import { useT } from '@/i18n/t';
import { AuthScreen } from '@/components/auth/AuthCard';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';
import { emailEnabled } from '@/server/email';

export const generateMetadata = localizedMeta({ title: 'Reset your password', robots: { index: false } });

export default function ForgotPasswordPage() {
  const t = useT();
  return (
    <AuthScreen>
      <div className="flex flex-col gap-4">
        <h1 className="text-[33px]">{t('Reset your password')}</h1>
        {emailEnabled() ? <ForgotPasswordForm /> : <p className="font-read text-[15px] text-muted">{t('Password reset is not available yet.')}</p>}
      </div>
    </AuthScreen>
  );
}
