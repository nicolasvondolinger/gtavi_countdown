import Link from 'next/link';
import type { ComponentProps } from 'react';

type Kind = 'primary' | 'secondary';
const kinds: Record<Kind, string> = {
  primary: 'bg-accent text-ink hover:bg-[#ff5590]',
  secondary: 'border border-edge text-text hover:border-control',
};
const base = 'inline-flex items-center justify-center gap-2 rounded-control px-[18px] py-2.5 text-[15px] font-semibold transition-colors duration-150 disabled:opacity-50';

export function Button({ kind = 'primary', className = '', ...props }: ComponentProps<'button'> & { kind?: Kind }) {
  return <button {...props} className={`${base} ${kinds[kind]} ${className}`} />;
}

export function LinkButton({ kind = 'primary', className = '', ...props }: ComponentProps<typeof Link> & { kind?: Kind }) {
  return <Link {...props} className={`${base} ${kinds[kind]} ${className}`} />;
}

export function TextLink({ className = '', ...props }: ComponentProps<typeof Link>) {
  return <Link {...props} className={`font-semibold text-accent hover:underline ${className}`} />;
}
