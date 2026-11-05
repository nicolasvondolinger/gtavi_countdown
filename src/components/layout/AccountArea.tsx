'use client';

import Link from 'next/link';
import { Avatar } from '@/components/ui/Avatar';
import { LinkButton } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { useViewer, type ViewerSummary } from './useViewer';

function Bell({ viewer }: { viewer: ViewerSummary }) {
  return (
    <Link href="/notifications" aria-label={viewer.unread ? `${viewer.unread} unread notifications` : 'Notifications'} className="relative shrink-0 hover:text-accent">
      <Icon name="bell" size={24} />
      {viewer.unread > 0 && <span aria-hidden="true" className="absolute top-0 right-0.5 size-2 bg-accent" />}
    </Link>
  );
}

export function AccountArea() {
  const viewer = useViewer();
  if (viewer === undefined) return <div className="h-9 w-[190px]" />;
  if (!viewer) {
    return (
      <div className="flex shrink-0 items-center gap-4">
        <Link href="/signin" className="text-[15px] font-semibold whitespace-nowrap hover:text-accent">Sign in</Link>
        <LinkButton href="/signup" kind="secondary" className="px-3.5! py-1.5! whitespace-nowrap">Create account</LinkButton>
      </div>
    );
  }
  return (
    <div className="flex shrink-0 items-center gap-3.5">
      {viewer.role === 'moderator' && <Link href="/moderation" className="hidden text-sm text-muted hover:text-text xl:inline">Moderate</Link>}
      {viewer.reviewer && (
        <Link href="/changes?filter=pending" className="hidden text-sm whitespace-nowrap text-muted hover:text-text xl:inline">
          Review <span className="font-data text-xs">{viewer.pending}</span>
        </Link>
      )}
      <Bell viewer={viewer} />
      <Link href={`/u/${viewer.username}`} className="flex items-center gap-2.5 hover:text-accent">
        <Avatar avatar={viewer.avatar} size={30} />
        <span className="flex flex-col">
          <span className="text-[13px] leading-4 font-semibold">{viewer.username}</span>
          <span className="font-data text-[11px] leading-4 whitespace-nowrap text-muted">lvl {viewer.level} · {viewer.rep.toLocaleString('en')} rep</span>
        </span>
      </Link>
    </div>
  );
}

export function MobileAccount() {
  const viewer = useViewer();
  if (!viewer) return <Link href="/signin" aria-label="Sign in" className="text-sm font-semibold">Sign in</Link>;
  return (
    <>
      <Bell viewer={viewer} />
      <Link href={`/u/${viewer.username}`} aria-label="Your profile">
        <Avatar avatar={viewer.avatar} size={28} />
      </Link>
    </>
  );
}
