'use client';

import { useT } from '@/i18n/t';
import Image from 'next/image';
import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { BASE_STATS, STAT_LABEL, statGains } from '@/lib/compare';
import { saveBuild } from '@/server/database/actions';
import type { ModCategory, Vehicle } from '@/server/database/queries';
import { StatBars } from './StatBars';

export function BuildEditor({ vehicles, vehicle, catalog }: { vehicles: Vehicle[]; vehicle: Vehicle; catalog: ModCategory[] }) {
  const t = useT();
  const [choices, setChoices] = useState<Record<string, number>>(() => Object.fromEntries(catalog.map(c => [c.slug, c.options[0]!.id])));
  const [open, setOpen] = useState(catalog[0]?.slug);
  const [name, setName] = useState(t('{name} build', { name: vehicle.name }));
  const [error, setError] = useState('');
  const [pending, start] = useTransition();
  const picked = catalog.map(c => c.options.find(o => o.id === choices[c.slug])!);
  const total = picked.reduce((sum, o) => sum + o.price, 0);
  const gains = statGains(picked);

  const save = () =>
    start(async () => {
      const result = await saveBuild({ vehicleId: vehicle.id, name, choices }, `/database/builds/new?vehicle=${vehicle.key}`);
      if (result?.error) setError(result.error);
    });

  return (
    <div className="grid gap-8 pb-20 lg:grid-cols-[minmax(0,1fr)_440px] lg:gap-10 lg:pb-0">
      <div className="flex min-w-0 flex-col gap-4">
        <input value={name} onChange={e => setName(e.target.value)} aria-label={t('Build name')} className="w-full border-b border-transparent bg-transparent font-display text-[33px] font-semibold hover:border-line focus:border-accent focus:outline-none lg:text-[41px]" />
        <label className="flex items-center gap-2 text-sm text-muted">
          {t('Vehicle')}
          <select value={vehicle.key} onChange={e => { window.location.search = `?vehicle=${e.target.value}`; }} className="rounded-control border border-control bg-bg px-2 py-1 text-text">
            {vehicles.map(v => <option key={v.key} value={v.key}>{v.name} ({v.game})</option>)}
          </select>
        </label>
        <div className="relative aspect-video overflow-hidden rounded-image bg-surface">
          {vehicle.image && <Image src={`/media/${vehicle.image}`} alt={vehicle.name} fill sizes="(min-width: 1024px) 55vw, 100vw" className="object-cover" />}
        </div>
        <StatBars base={BASE_STATS} gains={gains} labels={STAT_LABEL} />
      </div>
      <div className="flex flex-col gap-3">
        <h2 className="text-[26px] lg:text-[33px]">{t('Mods')}</h2>
        <div>
          {catalog.map((c, i) => {
            const current = picked[i]!;
            const expanded = open === c.slug;
            return (
              <div key={c.slug} className="border-t border-line">
                <button type="button" onClick={() => setOpen(expanded ? undefined : c.slug)} aria-expanded={expanded} className="flex w-full items-center gap-3 py-3 text-left">
                  <span className="w-[120px] shrink-0 text-[15px] font-semibold">{t(c.name)}</span>
                  <span className="flex-1 truncate text-[15px] text-soft">{t(current.name)}</span>
                  <span className="font-data text-[13px] text-muted">{current.price.toLocaleString('en')}</span>
                  <Icon name={expanded ? 'expand' : 'chevronRight'} size={20} className="text-muted" />
                </button>
                {expanded && (
                  <div className="flex flex-col gap-0.5 pb-3">
                    {c.options.map(o => (
                      <label key={o.id} className={`flex cursor-pointer items-center gap-3 rounded-control px-2.5 py-2 ${o.id === current.id ? 'bg-raised' : ''}`}>
                        <input type="radio" name={c.slug} checked={o.id === current.id} onChange={() => setChoices(v => ({ ...v, [c.slug]: o.id }))} className="size-4 accent-accent" />
                        <span className="flex-1 text-sm">{t(o.name)}</span>
                        <span className="font-data text-xs text-muted">{o.price.toLocaleString('en')}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {error && <p role="alert" className="text-sm text-removed">{error}</p>}
        <div className="fixed inset-x-0 bottom-[60px] z-20 flex items-center gap-3 border-t border-line bg-surface px-4 py-3 lg:static lg:flex-col lg:items-stretch lg:border-0 lg:bg-transparent lg:p-0">
          <div className="flex flex-1 flex-col lg:flex-row lg:items-baseline lg:justify-between lg:border-t lg:border-line lg:pt-3">
            <span className="text-xs text-muted lg:text-[17px] lg:font-semibold lg:text-text">{t('Total')}</span>
            <span className="font-data text-[17px] font-bold lg:text-[26px]">GTA$ {total.toLocaleString('en')}</span>
          </div>
          <Button onClick={save} disabled={pending} className="lg:py-3">{t('Save build')}</Button>
        </div>
        <p className="hidden text-[13px] text-dim lg:block">{t('Prices and stats are placeholders until in-game testing.')}</p>
      </div>
    </div>
  );
}
