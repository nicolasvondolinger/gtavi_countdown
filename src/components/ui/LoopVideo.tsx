'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

// The poster is the real image. The clip fades in on top, and stays out for reduced motion or data saver.
export function LoopVideo({ name, alt, sizes, priority }: { name: string; alt: string; sizes: string; priority?: boolean }) {
  const [play, setPlay] = useState(false);
  useEffect(() => {
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- media queries only exist in the browser.
    if (!saveData && !matchMedia('(prefers-reduced-motion: reduce)').matches) setPlay(true);
  }, []);
  return (
    <>
      <Image src={`/media/video/${name}.webp`} alt={alt} fill priority={priority} sizes={sizes} className="object-cover" />
      {play && <video src={`/media/video/${name}.mp4`} autoPlay muted loop playsInline aria-hidden="true" className="absolute inset-0 size-full object-cover" />}
    </>
  );
}
