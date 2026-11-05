'use client';

import Image from 'next/image';
import { useState } from 'react';
import { LoopVideo } from '@/components/ui/LoopVideo';
import { useT } from '@/i18n/t';

const SLIDES = [
  { src: 'art/key-01.webp', label: 'Lucia and Jason, key art' },
  { src: 'video/cover.webp', video: 'cover', label: 'Cover art, animated' },
  { src: 'art/key-lock-and-load.webp', label: 'Lock and load' },
  { src: 'art/key-robbery.webp', label: 'Robbery' },
];

export function HeroGallery() {
  const t = useT();
  const [current, setCurrent] = useState(0);
  const slide = SLIDES[current]!;
  const label = t(slide.label);
  return (
    <div className="flex flex-col gap-3.5">
      <div className="relative aspect-video overflow-hidden rounded-image">
        {slide.video ? <LoopVideo name={slide.video} alt={label} sizes="(min-width: 1024px) 60vw, 100vw" priority /> : <Image src={`/media/${slide.src}`} alt={label} fill priority sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover" />}
      </div>
      <div className="hidden grid-cols-4 gap-5 sm:grid">
        {SLIDES.map((s, i) => (
          <button key={s.src} type="button" onClick={() => setCurrent(i)} aria-pressed={i === current} className="flex flex-col gap-2 text-left">
            <span className={`relative aspect-video overflow-hidden rounded-image ${i === current ? 'outline-2 -outline-offset-2 outline-accent' : 'opacity-75 hover:opacity-100'}`}>
              <Image src={`/media/${s.src}`} alt="" fill sizes="200px" className="object-cover" />
            </span>
            <span className={`text-[13px] ${i === current ? 'text-text' : 'text-muted'}`}>{t(s.label)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
