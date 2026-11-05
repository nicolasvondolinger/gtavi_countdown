// Marks where official art goes until the project has it. Never fill this with a generic image.
export function ArtSlot({ label, className = '' }: { label: string; className?: string }) {
  return (
    <div className={`flex items-center justify-center border border-dashed border-edge bg-surface text-sm text-muted ${className}`}>
      [{label}]
    </div>
  );
}
