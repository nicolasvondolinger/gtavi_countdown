import { localizedMeta } from '@/i18n/page';
import { getLocale } from 'next-intl/server';
import { getT } from '@/i18n/server';
import { number } from '@/lib/format';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { AddVehicle } from '@/components/database/CompareControls';
import { ArtSlot } from '@/components/ui/ArtSlot';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Container } from '@/components/ui/Container';
import { CopyLink } from '@/components/ui/CopyLink';
import { Icon } from '@/components/ui/Icon';
import { bestIndex, parseVehicleKeys, type Direction } from '@/lib/compare';
import { getVehicles, type Vehicle } from '@/server/database/queries';
import { LinkButton } from '@/components/ui/Button';

export const generateMetadata = localizedMeta({ title: 'Compare vehicles', description: 'Compare vehicles from every Grand Theft Auto game side by side.' });

type Row = { label: string; value: (v: Vehicle) => number | null; unit?: string; direction?: Direction; format?: (n: number, locale: string) => string };
const ROWS: Row[] = [
  { label: 'Top speed', value: v => v.topSpeedMph, unit: 'mph', direction: 'high' },
  { label: '0 to 60', value: v => v.zeroToSixty, unit: 's', direction: 'low' },
  { label: 'Braking, 60 to 0', value: v => v.brakingFt, unit: 'ft', direction: 'low' },
  { label: 'Seats', value: v => v.seats, direction: 'high' },
  { label: 'Armor slots', value: v => v.armorSlots, direction: 'high' },
  { label: 'Price', value: v => v.price, unit: 'GTA$', format: number },
];
const DEFAULT = ['gta-online.cheetah-classic', 'gta-5.infernus', 'gta-6.grotti-cheetah'];

export default async function ComparePage({ searchParams }: { searchParams: Promise<{ v?: string }> }) {
  const t = await getT();
  const locale = await getLocale();
  const all = await getVehicles();
  const raw = (await searchParams).v;
  const keys = raw === undefined ? DEFAULT : parseVehicleKeys(raw);
  const picked = keys.map(k => all.find(v => v.key === k)).filter(v => v !== undefined);
  const others = all.filter(v => !picked.includes(v)).map(v => ({ key: v.key, label: `${v.name} (${v.game})` }));
  const remaining = (key: string) => picked.filter(v => v.key !== key).map(v => v.key).join(',');
  const grid = { gridTemplateColumns: `200px repeat(${picked.length + (picked.length < 4 ? 1 : 0)}, minmax(170px, 1fr))` };
  const cols = picked.map(v => v);

  return (
    <Container className="mt-5 mb-16 flex flex-col gap-5 lg:mt-7 lg:mb-20">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Database' }, { label: 'Vehicles' }, { label: 'Compare' }]} />
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <h1 className="text-[41px] lg:text-[56px]">{t('Compare vehicles')}</h1>
        <div className="flex gap-2.5">
          <CopyLink label={t('Copy link to this comparison')} />
          <LinkButton href="/database/builds/new" kind="secondary">{t('Open the build creator')}</LinkButton>
        </div>
      </div>
      {picked.some(v => v.specsSample) && (
        <p className="flex items-start gap-2.5 rounded-control border border-leak/30 px-3.5 py-2.5 font-read text-sm text-body">
          <Icon name="warning" className="mt-0.5 shrink-0 text-leak" />
          {t('Specs come from in-game testing. The numbers shown here are placeholders until that testing is done.')}
        </p>
      )}
      <div className="overflow-x-auto">
        <div className="grid min-w-max gap-x-6" style={grid}>
          <p className="self-end pb-3 text-sm text-muted">{t('{n} of 4 slots used', { n: picked.length })}</p>
          {cols.map(v => (
            <div key={v.key} className="flex flex-col gap-2 pb-3">
              {v.image ? (
                <div className="relative aspect-video overflow-hidden rounded-image"><Image src={`/media/${v.image}`} alt="" fill sizes="280px" className="object-cover" /></div>
              ) : (
                <ArtSlot label={t('{name} image', { name: v.name })} className="aspect-video text-[13px]" />
              )}
              <div className="flex items-start justify-between gap-2">
                <span className="text-[17px] font-semibold">{v.name}</span>
                <Link href={`?v=${remaining(v.key)}`} aria-label={t('Remove {name}', { name: v.name })} className="text-muted hover:text-text"><Icon name="close" /></Link>
              </div>
              <span className="text-[13px] text-muted">{v.game} · {v.class}</span>
            </div>
          ))}
          {picked.length < 4 && <div className="pb-3"><AddVehicle options={others} current={picked.map(v => v.key)} /></div>}
          {ROWS.map(row => {
            const values = picked.map(row.value);
            const best = row.direction ? bestIndex(values, row.direction) : -1;
            return [
              <p key={row.label} className="border-t border-line py-3 text-[15px] font-semibold">{t(row.label)}</p>,
              ...picked.map((v, i) => {
                const value = values[i] ?? null;
                return (
                  <p key={row.label + v.key} className="flex items-baseline gap-2 border-t border-line py-3">
                    {value === null ? <span className="text-[15px] text-dim">{t('Unknown')}</span> : <span className={`font-data text-[15px] ${i === best ? 'font-bold' : 'text-soft'}`}>{row.format?.(value, locale) ?? value}</span>}
                    {value !== null && row.unit && <span className="text-[13px] text-muted">{row.unit}</span>}
                    {i === best && <span className="text-xs font-semibold text-accent">{t('best')}</span>}
                  </p>
                );
              }),
              ...(picked.length < 4 ? [<span key={`${row.label}-add`} className="border-t border-line" />] : []),
            ];
          })}
        </div>
      </div>
    </Container>
  );
}
