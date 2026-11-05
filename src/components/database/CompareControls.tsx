'use client';

import { useT } from '@/i18n/t';
import { useRouter } from '@/i18n/navigation';
import type { ChangeEvent } from 'react';

export function AddVehicle({ options, current }: { options: { key: string; label: string }[]; current: string[] }) {
  const t = useT();
  const router = useRouter();
  const add = (e: ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value) router.push(`?v=${[...current, e.target.value].join(',')}`);
  };
  return (
    <label className="flex h-full min-h-[120px] flex-col items-center justify-center gap-2 border border-dashed border-edge p-3 text-sm font-semibold">
      {t('Add a vehicle')}
      <select onChange={add} defaultValue="" aria-label={t('Add a vehicle')} className="w-full rounded-control border border-control bg-bg px-2 py-1.5 text-sm font-normal">
        <option value="" disabled>{t('Choose')}</option>
        {options.map(o => <option key={o.key} value={o.key}>{o.label}</option>)}
      </select>
    </label>
  );
}
