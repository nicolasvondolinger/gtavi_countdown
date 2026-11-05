'use client';

import { useLocale } from 'next-intl';
import { useT } from '@/i18n/t';
import { number } from '@/lib/format';
import { Link } from '@/i18n/navigation';
import { Avatar } from '@/components/ui/Avatar';
import { LinkButton } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { useViewer, type ViewerSummary } from './useViewer';

function Bell({ viewer }: { viewer: ViewerSummary }) {
  const t = useT();
  return (
    <Link href="/notifications" aria-label={viewer.unread ? t('{n} unread notifications', { n: viewer.unread }) : t('Notifications')} className="relative shrink-0 hover:text-accent">
      <Icon name="bell" size={24} />
      {viewer.unread > 0 && <span aria-hidden="true" className="absolute top-0 right-0.5 size-2 bg-accent" />}
    </Link>
  );
}

export function AccountArea() {
  const t = useT();
  const locale = useLocale();
  const viewer = useViewer();
  if (viewer === undefined) return <div className="h-9 w-[190px]" />;
  if (!viewer) {
    return (
      <div className="flex shrink-0 items-center gap-4">
        <Link href="/signin" className="text-[15px] font-semibold whitespace-nowrap hover:text-accent">{t('Sign in')}</Link>
        <LinkButton href="/signup" kind="secondary" className="px-3.5! py-1.5! whitespace-nowrap">{t('Create account')}</LinkButton>
      </div>
    );
  }
  return (
    <div className="flex shrink-0 items-center gap-3.5">
      {viewer.role === 'moderator' && <Link href="/moderation" className="hidden text-sm text-muted hover:text-text xl:inline">{t('Moderate')}</Link>}
      {viewer.reviewer && (
        <Link href="/changes?filter=pending" className="hidden text-sm whitespace-nowrap text-muted hover:text-text xl:inline">
          {t('Review')}{' '}<span className="font-data text-xs">{viewer.pending}</span>
        </Link>
      )}
      <Bell viewer={viewer} />
      <Link href={`/u/${viewer.username}`} className="flex items-center gap-2.5 hover:text-accent">
        <Avatar avatar={viewer.avatar} size={30} />
        <span className="flex flex-col">
          <span className="max-w-[110px] truncate text-[13px] leading-4 font-semibold">{viewer.username}</span>
          <span className="font-data text-[11px] leading-4 whitespace-nowrap text-muted">{t('lvl {level} · {rep} rep', { level: viewer.level, rep: number(viewer.rep, locale) })}</span>
        </span>
      </Link>
    </div>
  );
}

export function MobileAccount() {
  const t = useT();
  const viewer = useViewer();
  if (!viewer) return <Link href="/signin" aria-label={t('Sign in')} className="text-sm font-semibold">{t('Sign in')}</Link>;
  return (
    <>
      <Bell viewer={viewer} />
      <Link href={`/u/${viewer.username}`} aria-label={t('Your profile')}>
        <Avatar avatar={viewer.avatar} size={28} />
      </Link>
    </>
  );
}
