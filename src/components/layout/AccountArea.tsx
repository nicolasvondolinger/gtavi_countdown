import Link from 'next/link';
import { LinkButton } from '@/components/ui/Button';

export function AccountArea() {
  return (
    <div className="flex items-center gap-4">
      <Link href="/signin" className="text-[15px] font-semibold hover:text-accent">Sign in</Link>
      <LinkButton href="/signup" kind="secondary" className="px-3.5! py-1.5!">Create account</LinkButton>
    </div>
  );
}
