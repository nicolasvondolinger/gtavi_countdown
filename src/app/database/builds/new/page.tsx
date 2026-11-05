import type { Metadata } from 'next';
import { BuildEditor } from '@/components/database/BuildEditor';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Container } from '@/components/ui/Container';
import { getModCatalog, getVehicles } from '@/server/database/queries';

export const metadata: Metadata = { title: 'Build creator', description: 'Build and share vehicle setups.' };

export default async function NewBuildPage({ searchParams }: { searchParams: Promise<{ vehicle?: string }> }) {
  const key = (await searchParams).vehicle ?? 'gta-online.cheetah-classic';
  const [vehicles, catalog] = await Promise.all([getVehicles(), getModCatalog()]);
  const vehicle = vehicles.find(v => v.key === key) ?? vehicles[0];
  return (
    <Container className="mt-5 mb-16 flex flex-col gap-4 lg:mt-7 lg:mb-20">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Games', href: '/games' }, { label: vehicle?.game ?? 'Database', href: vehicle ? `/${vehicle.gameSlug}` : undefined }, { label: 'Builds' }, { label: 'New build' }]} />
      {vehicle && catalog.length > 0 ? <BuildEditor key={vehicle.key} vehicles={vehicles} vehicle={vehicle} catalog={catalog} /> : <p className="font-read text-[15px] text-muted">Mods for this vehicle have not been added yet.</p>}
    </Container>
  );
}
