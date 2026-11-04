import type { ComponentProps, ReactNode } from 'react';

export function Field({ label, error, help, aside, ...input }: ComponentProps<'input'> & { label: string; error?: string; help?: ReactNode; aside?: ReactNode }) {
  const id = input.id ?? input.name;
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-sm font-semibold text-soft">{label}</label>
        {aside}
      </div>
      <input
        {...input}
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error || help ? `${id}-help` : undefined}
        className={`rounded-control border bg-bg px-3 py-2.5 text-[15px] text-text placeholder:text-dim focus:outline-2 focus:outline-accent ${error ? 'border-removed' : 'border-control'}`}
      />
      {(error || help) && <p id={`${id}-help`} className={`text-[13px] ${error ? 'text-removed' : 'text-muted'}`}>{error ?? help}</p>}
    </div>
  );
}
