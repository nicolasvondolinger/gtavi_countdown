import { useLocale } from 'next-intl';
import { timeAgo } from '@/lib/format';

export function TimeAgo({ date }: { date: Date }) {
  return <time dateTime={date.toISOString()} suppressHydrationWarning>{timeAgo(date, undefined, useLocale())}</time>;
}
