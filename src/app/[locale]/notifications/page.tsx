import { getLocale } from 'next-intl/server';
import { localize } from '@/i18n/localize';
import { TimeAgo } from '@/components/ui/TimeAgo';
import { localizedMeta } from '@/i18n/page';
import { getT } from '@/i18n/server';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { requireViewer } from '@/server/auth/session';
import { getNotifications } from '@/server/notifications';
import { readAll } from '@/server/notifications-actions';

export const generateMetadata = localizedMeta({ title: 'Notifications', robots: { index: false } });

export default async function NotificationsPage() {
  const t = await getT();
  const viewer = await requireViewer('/notifications');
  const locale = await getLocale();
  const items = (await getNotifications(viewer.user.id)).map(n => localize(n, locale));
  const unread = items.some(n => !n.readAt);
  return (
    <Container className="mt-6 mb-16 flex max-w-[760px]! flex-col gap-4 lg:mt-8">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-[41px]">{t('Notifications')}</h1>
        {unread && <form action={readAll}><Button kind="secondary">{t('Mark all as read')}</Button></form>}
      </div>
      {items.length === 0 && <p className="font-read text-[15px] text-muted">{t('Replies and review results will show up here.')}</p>}
      <ul>
        {items.map(n => (
          <li key={n.id} className="border-t border-line">
            <Link href={n.href} className="flex items-baseline gap-3 py-3 hover:text-accent">
              {!n.readAt && <span aria-label={t('Unread')} className="size-2 shrink-0 bg-accent" />}
              <span className={`flex-1 text-[15px] ${n.readAt ? 'text-muted' : 'font-semibold'}`}>{n.title}</span>
              <span className="shrink-0 font-data text-xs text-muted"><TimeAgo date={n.createdAt} /></span>
            </Link>
          </li>
        ))}
      </ul>
    </Container>
  );
}
