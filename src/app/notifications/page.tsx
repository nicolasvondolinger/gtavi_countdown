import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { timeAgo } from '@/lib/format';
import { requireViewer } from '@/server/auth/session';
import { getNotifications } from '@/server/notifications';
import { readAll } from '@/server/notifications-actions';

export const metadata: Metadata = { title: 'Notifications', robots: { index: false } };

export default async function NotificationsPage() {
  const viewer = await requireViewer('/notifications');
  const items = await getNotifications(viewer.user.id);
  const unread = items.some(n => !n.readAt);
  return (
    <Container className="mt-6 mb-16 flex max-w-[760px]! flex-col gap-4 lg:mt-8">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-[41px]">Notifications</h1>
        {unread && <form action={readAll}><Button kind="secondary">Mark all as read</Button></form>}
      </div>
      {items.length === 0 && <p className="font-read text-[15px] text-muted">Replies and review results will show up here.</p>}
      <ul>
        {items.map(n => (
          <li key={n.id} className="border-t border-line">
            <Link href={n.href} className="flex items-baseline gap-3 py-3 hover:text-accent">
              {!n.readAt && <span aria-label="Unread" className="size-2 shrink-0 bg-accent" />}
              <span className={`flex-1 text-[15px] ${n.readAt ? 'text-muted' : 'font-semibold'}`}>{n.title}</span>
              <span className="shrink-0 font-data text-xs text-muted">{timeAgo(n.createdAt)}</span>
            </Link>
          </li>
        ))}
      </ul>
    </Container>
  );
}
