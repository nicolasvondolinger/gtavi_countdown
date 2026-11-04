import { Children, Fragment, type ReactNode } from 'react';

// A line of metadata with quiet separators.
export function Meta({ children }: { children: ReactNode }) {
  const parts = Children.toArray(children);
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-muted">
      {parts.map((part, i) => (
        <Fragment key={i}>
          {i > 0 && <span aria-hidden="true" className="text-dim">·</span>}
          {part}
        </Fragment>
      ))}
    </div>
  );
}
