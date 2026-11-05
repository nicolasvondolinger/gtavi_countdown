import { and, desc, eq, isNull } from 'drizzle-orm';
import { translate, type Vars } from '@/i18n/translate';
import { db, schema, type Db } from '@/server/db';

const { notifications } = schema;
type Tx = Parameters<Parameters<Db['transaction']>[0]>[0] | Db;

// People are never told about their own actions.
export async function notify(tx: Tx, input: { userId: string | null; actorId?: string | null; title: string; vars?: Vars; href: string }) {
  const { userId, actorId, title, vars, href } = input;
  if (!userId || userId === actorId) return;
  await tx.insert(notifications).values({ userId, title: translate('en', title, vars), i18n: { pt: { title: translate('pt', title, vars) } }, href });
}

export const unreadCount = (userId: string) => db.$count(notifications, and(eq(notifications.userId, userId), isNull(notifications.readAt)));

export const getNotifications = (userId: string, limit = 50) => db.select().from(notifications).where(eq(notifications.userId, userId)).orderBy(desc(notifications.createdAt)).limit(limit);

export const markAllRead = (userId: string) => db.update(notifications).set({ readAt: new Date() }).where(and(eq(notifications.userId, userId), isNull(notifications.readAt)));
