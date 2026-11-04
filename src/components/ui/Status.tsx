export type Verification = 'official' | 'leak' | 'theory';

const STATUS: Record<Verification, { label: string; text: string; mark: string }> = {
  official: { label: 'Official', text: 'text-official', mark: 'bg-official' },
  leak: { label: 'Unverified leak', text: 'text-leak', mark: 'bg-leak' },
  theory: { label: 'Community theory', text: 'text-theory', mark: 'border-[1.5px] border-theory' },
};

export function Status({ kind, source }: { kind: Verification; source?: string | null }) {
  const s = STATUS[kind];
  return (
    <span className="inline-flex items-center gap-1.5 text-[13px]">
      <span aria-hidden="true" className={`size-2 shrink-0 ${s.mark}`} />
      <span className={`font-semibold ${s.text}`}>{s.label}</span>
      {source && <span className="text-muted">{source}</span>}
    </span>
  );
}
