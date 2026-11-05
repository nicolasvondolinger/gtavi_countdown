import { useT } from '@/i18n/t';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import type { ReactNode } from 'react';

export function AuthScreen({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-[calc(100dvh-68px)] items-center justify-center lg:px-4 lg:py-10">
      <Image src="/media/art/key-01.webp" alt="" fill loading="eager" sizes="100vw" className="hidden object-cover opacity-20 lg:block" />
      <div className="relative w-full bg-bg px-4 py-5 lg:w-[460px] lg:rounded-modal lg:border lg:border-edge lg:p-8 lg:shadow-[0_24px_64px_#000000b3]">{children}</div>
    </div>
  );
}

export function AuthTabs({ active, next }: { active: 'signin' | 'signup'; next: string }) {
  const t = useT();
  const q = next === '/' ? '' : `?next=${encodeURIComponent(next)}`;
  const tabs = [['signin', 'Sign in', `/signin${q}`], ['signup', 'Create account', `/signup${q}`]] as const;
  return (
    <div className="flex gap-6 border-b border-line">
      {tabs.map(([key, label, href]) => (
        <Link key={key} href={href} aria-current={key === active ? 'page' : undefined} className={`-mb-px border-b-2 py-2 text-base ${key === active ? 'border-accent font-semibold' : 'border-transparent text-muted hover:text-text'}`}>
          {t(label)}
        </Link>
      ))}
    </div>
  );
}
