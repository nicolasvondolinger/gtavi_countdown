import { useT } from '@/i18n/t';
export function StatBars({ base, gains, labels }: { base: Record<string, number>; gains: Record<string, number>; labels: Record<string, string> }) {
  const t = useT();
  return (
    <div className="flex flex-col gap-3 pt-2">
      <div className="flex gap-4 text-[13px] text-muted">
        <span className="flex items-center gap-1.5"><span aria-hidden="true" className="size-2.5 bg-control" />{t('Stock')}</span>
        <span className="flex items-center gap-1.5"><span aria-hidden="true" className="size-2.5 bg-accent" />{t('This build')}</span>
      </div>
      <dl className="flex flex-col gap-3">
        {Object.entries(base).map(([stat, value]) => {
          const gain = gains[stat] ?? 0;
          return (
            <div key={stat} className="flex items-center gap-4">
              <dt className="w-[100px] shrink-0 text-sm">{t(labels[stat] ?? stat)}</dt>
              <dd aria-hidden="true" className="flex h-2 flex-1 bg-raised">
                <span className="bg-control" style={{ width: `${value}%` }} />
                <span className="bg-accent transition-[width] duration-150" style={{ width: `${Math.min(gain, 100 - value)}%` }} />
              </dd>
              <dd className={`w-9 shrink-0 font-data text-[13px] ${gain ? 'text-accent' : 'text-muted'}`}>{gain ? `+${gain}` : '0'}</dd>
            </div>
          );
        })}
      </dl>
    </div>
  );
}
