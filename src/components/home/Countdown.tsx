'use client';

import { useEffect, useState } from 'react';

const parts = (ms: number) => ({
  days: Math.floor(ms / 864e5),
  hours: Math.floor((ms / 36e5) % 24),
  minutes: Math.floor((ms / 6e4) % 60),
  seconds: Math.floor((ms / 1e3) % 60),
});
const pad = (n: number) => String(n).padStart(2, '0');

// One instant for everyone: the game launches at the same moment worldwide.
export function Countdown({ target }: { target: string }) {
  const end = new Date(target).getTime();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const left = end - now;
  if (left <= 0) return <p className="font-display text-[56px] leading-none">Out now</p>;
  const { days, hours, minutes, seconds } = parts(left);
  return (
    <div role="timer" aria-label={`${days} days until launch`}>
      <p className="flex items-baseline gap-2.5">
        <span className="font-data text-[72px] leading-none font-bold lg:text-[96px]" suppressHydrationWarning>{days}</span>
        <span className="text-[26px] text-muted">{days === 1 ? 'day' : 'days'}</span>
      </p>
      <p className="mt-1 font-data text-[21px] text-soft" suppressHydrationWarning>
        {pad(hours)} h {pad(minutes)} m {pad(seconds)} s
      </p>
    </div>
  );
}
