import type { Metadata } from 'next';
import { LegalPage } from '@/components/ui/LegalPage';

export const metadata: Metadata = { title: 'Privacy Policy' };

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy">
      <p><strong>Draft. This text needs legal review before launch.</strong></p>
      <h2>What we store</h2>
      <p>Your email address, username, avatar choice, the contributions you make, your votes and, if you sign in with Google, Apple or Discord, the account identifier that provider returns.</p>
      <h2>Why</h2>
      <p>To run your account, show your contributions and calculate reputation. Marketing email is sent only if you opt in, and you can opt out at any time.</p>
      <h2>Your data</h2>
      <p>Contact the site operator to request a copy or deletion of your data.</p>
    </LegalPage>
  );
}
