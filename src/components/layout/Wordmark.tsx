import { useT } from '@/i18n/t';
import { Link } from '@/i18n/navigation';

export function Wordmark({ size = 22 }: { size?: number }) {
  const t = useT();
  return (
    <Link href="/" aria-label={t('GTA Wiki home')} className="inline-flex items-baseline gap-1.5">
      <span className="font-display font-bold" style={{ fontSize: size + 4 }}>GTA</span>
      <span className="text-muted" style={{ fontSize: Math.round(size * 0.72) }}>wiki</span>
    </Link>
  );
}
