import { pageLocale } from '@/i18n/page';
import { getT } from '@/i18n/server';
import { translate } from '@/i18n/translate';
import type { Metadata } from 'next';
import { Link } from '@/i18n/navigation';
import { notFound } from 'next/navigation';
import { MapView } from '@/components/map/MapView';
import { ArtSlot } from '@/components/ui/ArtSlot';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Container } from '@/components/ui/Container';
import { getMarkers } from '@/server/map/queries';
import { getGame } from '@/server/wiki/queries';

export const revalidate = 60;
export function generateStaticParams() {
  return [];
}

type Props = { params: Promise<{ locale: string; game: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, game: slug } = await params;
  const game = await getGame(slug, locale);
  return game ? { title: translate(locale, '{place} map', { place: game.shortName }), description: translate(locale, 'Interactive map of {place}.', { place: game.setting }) } : {};
}

const MAPS = [['gta-6', 'Leonida'], ['gta-5', 'Los Santos and Blaine County'], ['gta-san-andreas', 'San Andreas'], ['gta-4', 'Liberty City'], ['gta-vice-city', 'Vice City']] as const;

export default async function MapPage({ params }: Props) {
  const locale = await pageLocale(params);
  const t = await getT();
  const game = await getGame((await params).game, locale);
  if (!game) notFound();
  const otherMaps = MAPS.filter(([slug]) => slug !== game.slug).map(([slug, label]) => ({ href: `/${slug}/map`, label: t(label) }));
  const crumbs = <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Games', href: '/games' }, { label: game.shortName, href: `/${game.slug}` }, { label: 'Map' }]} />;

  if (game.slug !== 'gta-6') {
    return (
      <Container className="mt-5 mb-16 flex flex-col gap-4 lg:mt-7">
        {crumbs}
        <h1 className="text-[41px] lg:text-[56px]">{t('{place} map', { place: game.shortName })}</h1>
        <ArtSlot label={t('map of {place}', { place: game.setting })} className="aspect-video max-h-[520px]" />
        <p className="font-read text-[15px] text-muted">{t('This map has not been plotted yet.')}</p>
        <div className="flex flex-wrap gap-4">{otherMaps.map(m => <Link key={m.href} href={m.href} className="text-sm font-semibold text-accent hover:underline">{m.label}</Link>)}</div>
      </Container>
    );
  }
  const markers = await getMarkers(game.id, locale);
  return (
    <>
      <div className="px-4 pt-3 lg:hidden">{crumbs}</div>
      <MapView markers={markers} otherMaps={otherMaps} title={t('{place} map', { place: 'Leonida' })} />
    </>
  );
}
