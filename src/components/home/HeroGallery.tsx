'use client';

import Image from 'next/image';
import { useState } from 'react';

const SLIDES = [
  { src: '/media/bg/hero.webp', label: 'Lucia and Jason, key art' },
  { src: '/media/bg/duo3.webp', label: 'Trailer 2, Vice City beach' },
  { src: '/media/world/leonida_keys.webp', label: 'Leonida Keys' },
  { src: '/media/bg/motel.webp', label: 'Motel, Trailer 2' },
];

export function HeroGallery() {
  const [current, setCurrent] = useState(0);
  const slide = SLIDES[current]!;
  return (
    <div className="flex flex-col gap-3.5">
      <div className="relative aspect-video overflow-hidden rounded-image">
        <Image src={slide.src} alt={slide.label} fill priority sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover" />
      </div>
      <div className="hidden grid-cols-4 gap-5 sm:grid">
        {SLIDES.map((s, i) => (
          <button key={s.src} type="button" onClick={() => setCurrent(i)} aria-pressed={i === current} className="flex flex-col gap-2 text-left">
            <span className={`relative aspect-video overflow-hidden rounded-image ${i === current ? 'outline-2 -outline-offset-2 outline-accent' : 'opacity-75 hover:opacity-100'}`}>
              <Image src={s.src} alt="" fill sizes="200px" className="object-cover" />
            </span>
            <span className={`text-[13px] ${i === current ? 'text-text' : 'text-muted'}`}>{s.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
