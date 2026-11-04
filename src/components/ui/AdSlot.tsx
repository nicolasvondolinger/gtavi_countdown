const SIZES = {
  '970x90': 'hidden lg:flex h-[90px] w-[970px]',
  '728x90': 'hidden md:flex h-[90px] w-[728px]',
  '320x50': 'flex md:hidden h-[50px] w-[320px]',
  '300x250': 'flex h-[250px] w-[300px]',
  '300x600': 'hidden lg:flex h-[600px] w-[300px]',
} as const;

// Reserved space so an ad never shifts the page. Use only outside article text and spoilers.
export function AdSlot({ size }: { size: keyof typeof SIZES }) {
  return (
    <aside aria-label="Advertisement" className={`${SIZES[size]} shrink-0 flex-col items-center justify-center gap-0.5 border border-dashed border-line text-dim`}>
      <span className="text-xs">Advertisement</span>
      <span className="font-data text-[11px]">{size.replace('x', '×')}</span>
    </aside>
  );
}

export function AdStrip({ size = '970x90' }: { size?: '970x90' | '728x90' }) {
  return (
    <div className="flex justify-center bg-[#07090d] py-2.5">
      <AdSlot size={size} />
      <AdSlot size="320x50" />
    </div>
  );
}
