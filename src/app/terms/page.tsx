import type { Metadata } from 'next';
import { LegalPage } from '@/components/ui/LegalPage';

export const metadata: Metadata = { title: 'Terms of Service' };

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service">
      <p><strong>Draft. This text needs legal review before launch.</strong></p>
      <h2>Contributions</h2>
      <p>You keep the rights to what you post and allow GTA Wiki to display and edit it as part of the wiki.</p>
      <h2>Conduct</h2>
      <p>Tag spoilers, cite sources, and do not post leaked game builds, piracy links or personal information about others.</p>
      <h2>Moderation</h2>
      <p>Edits can be reverted and accounts can be limited when they break these rules.</p>
    </LegalPage>
  );
}
