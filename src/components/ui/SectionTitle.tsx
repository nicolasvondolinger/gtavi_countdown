import type { ReactNode } from 'react';

export function SectionTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <h2 className="text-[26px] lg:text-[33px]">{children}</h2>
      {action}
    </div>
  );
}
