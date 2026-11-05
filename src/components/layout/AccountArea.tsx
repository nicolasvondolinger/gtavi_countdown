'use client';

import Link from 'next/link';
import { Avatar } from '@/components/ui/Avatar';
import { LinkButton } from '@/components/ui/Button';
import { useViewer } from './useViewer';

export function AccountArea() {
  const viewer = useViewer();
  if (viewer === undefined) return <div className="h-9 w-[190px]" />;
  if (!viewer) {
    return (
      <div className="flex items-center gap-4">
        <Link href="/signin" className="text-[15px] font-semibold hover:text-accent">Sign in</Link>
        <LinkButton href="/signup" kind="secondary" className="px-3.5! py-1.5!">Create account</LinkButton>
      </div>
    );
  }
  return (
    <Link href={`/u/${viewer.username}`} className="flex items-center gap-2.5 hover:text-accent">
      <Avatar avatar={viewer.avatar} size={30} />
      <span className="flex flex-col">
        <span className="text-[13px] leading-4 font-semibold">{viewer.username}</span>
        <span className="font-data text-[11px] leading-4 text-muted">lvl {viewer.level} · {viewer.rep.toLocaleString('en')} rep</span>
      </span>
    </Link>
  );
}

export function MobileAccount() {
  const viewer = useViewer();
  if (!viewer) return <Link href="/signin" aria-label="Sign in" className="text-sm font-semibold">Sign in</Link>;
  return (
    <Link href={`/u/${viewer.username}`} aria-label="Your profile">
      <Avatar avatar={viewer.avatar} size={28} />
    </Link>
  );
}
