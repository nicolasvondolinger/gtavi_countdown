import Link from 'next/link';

export function Wordmark({ size = 22 }: { size?: number }) {
  return (
    <Link href="/" aria-label="GTA Wiki home" className="inline-flex items-baseline gap-1.5">
      <span className="font-display font-bold" style={{ fontSize: size + 4 }}>GTA</span>
      <span className="text-muted" style={{ fontSize: Math.round(size * 0.72) }}>wiki</span>
    </Link>
  );
}
