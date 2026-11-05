import type { Metadata } from 'next';
import { LegalPage } from '@/components/ui/LegalPage';

export const metadata: Metadata = { title: 'About', description: 'GTA Wiki is an independent, fan-run wiki and forum for the Grand Theft Auto series.' };

export default function AboutPage() {
  return (
    <LegalPage title="About GTA Wiki">
      <p>GTA Wiki is a fan-run encyclopedia and forum for the whole Grand Theft Auto series, from the 1997 original to GTA VI.</p>
      <h2>How facts are checked</h2>
      <p>Every claim about an unreleased game carries a label: Official when Rockstar, a platform holder or a ratings board said it; Unverified leak when it comes from a datamine or leaked material; Community theory when it is a reasoned guess.</p>
      <p>Edits with an official source publish at once. Everything else waits for five community reviewers.</p>
      <h2>Independence</h2>
      <p>GTA Wiki is not affiliated with, endorsed or sponsored by Rockstar Games or Take-Two Interactive. Grand Theft Auto, its logos and artwork belong to their owners and are used here for reference and commentary.</p>
    </LegalPage>
  );
}
