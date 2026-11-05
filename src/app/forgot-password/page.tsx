import type { Metadata } from 'next';
import { AuthScreen } from '@/components/auth/AuthCard';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';
import { emailEnabled } from '@/server/email';

export const metadata: Metadata = { title: 'Reset your password', robots: { index: false } };

export default function ForgotPasswordPage() {
  return (
    <AuthScreen>
      <div className="flex flex-col gap-4">
        <h1 className="text-[33px]">Reset your password</h1>
        {emailEnabled() ? <ForgotPasswordForm /> : <p className="font-read text-[15px] text-muted">Password reset is not available yet.</p>}
      </div>
    </AuthScreen>
  );
}
