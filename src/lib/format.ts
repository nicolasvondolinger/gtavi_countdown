const units: [Intl.RelativeTimeFormatUnit, number][] = [['year', 31536e6], ['month', 2592e6], ['day', 864e5], ['hour', 36e5], ['minute', 6e4]];
const relative = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

export function timeAgo(date: Date, now = Date.now()) {
  const diff = date.getTime() - now;
  for (const [unit, ms] of units) {
    if (Math.abs(diff) >= ms) return relative.format(Math.round(diff / ms), unit);
  }
  return 'just now';
}

export function compact(n: number) {
  if (Math.abs(n) >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1).replace(/\.0$/, '')}k`;
  return String(n);
}

export function longDate(date: Date) {
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(date);
}

export function dayMonth(date: Date) {
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' }).format(date);
}

export function clock(date: Date) {
  return new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' }).format(date);
}
