import { localizedMeta } from '@/i18n/page';
import { getT } from '@/i18n/server';
import { redirect } from 'next/navigation';
import { AuthScreen } from '@/components/auth/AuthCard';
import { OnboardingForm } from '@/components/auth/OnboardingForm';
import { safeNext } from '@/lib/account';
import { getViewer } from '@/server/auth/session';
import { getGames } from '@/server/wiki/queries';

export const generateMetadata = localizedMeta({ title: 'Pick how people see you', robots: { index: false } });

const FAVOURITES = ['gta-6', 'gta-5', 'gta-online', 'gta-4', 'gta-san-andreas', 'gta-vice-city'];

export default async function OnboardingPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const t = await getT();
  const next = safeNext((await searchParams).next);
  const viewer = await getViewer();
  if (!viewer) redirect(`/signin?next=${encodeURIComponent(next)}`);
  if (viewer.profile.onboardedAt) redirect(next);
  const games = (await getGames('en')).filter(g => FAVOURITES.includes(g.slug)).map(g => ({ id: g.id, name: g.shortName, year: g.year }));
  return (
    <AuthScreen>
      <div className="flex flex-col gap-3">
        <h1 className="text-[33px] lg:text-[41px]">{t('Pick how people see you')}</h1>
        <p className="font-read text-[15px] text-muted">{t('Your avatar and gamertag show next to your edits, theories and posts.')}</p>
        <OnboardingForm username={viewer.profile.username} games={games} next={next} />
      </div>
    </AuthScreen>
  );
}
