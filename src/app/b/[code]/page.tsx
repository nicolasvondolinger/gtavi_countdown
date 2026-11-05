import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { StatBars } from '@/components/database/StatBars';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { LinkButton } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Tag } from '@/components/ui/Tag';
import { BASE_STATS, STAT_LABEL, statGains } from '@/lib/compare';
import { getBuild, getModCatalog } from '@/server/database/queries';

type Props = { params: Promise<{ code: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const row = await getBuild((await params).code);
  return row ? { title: `${row.build.name} (${row.game.shortName})` } : {};
}

export default async function BuildPage({ params }: Props) {
  const row = await getBuild((await params).code);
  if (!row) notFound();
  const catalog = await getModCatalog();
  const lines = catalog.flatMap(c => {
    const option = c.options.find(o => o.id === row.build.choices[c.slug]);
    return option ? [{ category: c.name, option }] : [];
  });
  const total = lines.reduce((sum, l) => sum + l.option.price, 0);
  return (
    <Container className="mt-5 mb-16 flex flex-col gap-4 lg:mt-7 lg:mb-20">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Games', href: '/games' }, { label: row.game.shortName, href: `/${row.game.slug}` }, { label: 'Builds' }, { label: row.build.name }]} />
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_440px] lg:gap-10">
        <div className="flex flex-col gap-4">
          <h1 className="text-[33px] lg:text-[41px]">{row.build.name}</h1>
          <div className="flex items-center gap-2 text-[13px] text-muted"><Tag>{row.game.shortName}</Tag>{row.vehicle.name}{row.author && ` · by ${row.author}`}</div>
          {row.vehicle.image && <div className="relative aspect-video overflow-hidden rounded-image"><Image src={`/media/${row.vehicle.image}`} alt={row.vehicle.name} fill sizes="(min-width: 1024px) 55vw, 100vw" className="object-cover" /></div>}
          <StatBars base={BASE_STATS} gains={statGains(lines.map(l => l.option))} labels={STAT_LABEL} />
        </div>
        <div className="flex flex-col gap-3">
          <h2 className="text-[26px] lg:text-[33px]">Mods</h2>
          <dl>
            {lines.map(l => (
              <div key={l.category} className="flex items-center gap-3 border-t border-line py-3">
                <dt className="w-[120px] shrink-0 text-[15px] font-semibold">{l.category}</dt>
                <dd className="flex-1 text-[15px] text-soft">{l.option.name}</dd>
                <dd className="font-data text-[13px] text-muted">{l.option.price.toLocaleString('en')}</dd>
              </div>
            ))}
          </dl>
          <p className="flex items-baseline justify-between border-t border-line pt-3"><span className="text-[17px] font-semibold">Total</span><span className="font-data text-[26px] font-bold">GTA$ {total.toLocaleString('en')}</span></p>
          <LinkButton href={`/database/builds/new?vehicle=${row.game.slug}.${row.vehicle.slug}`} kind="secondary">Make your own</LinkButton>
        </div>
      </div>
    </Container>
  );
}
