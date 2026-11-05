'use client';

import Image from 'next/image';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

const BlurContext = createContext({ blur: true, change: (_on: boolean) => {} });
const KEY = 'gta-wiki-blur-spoilers';

// Blur is on by default. The choice is a per-browser convenience.
export function SpoilerScope({ children }: { children: ReactNode }) {
  const [blur, setBlur] = useState(true);
  useEffect(() => {
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- browser storage is only readable after mount
      if (localStorage.getItem(KEY) === 'off') setBlur(false);
    } catch {
      // Blocked storage keeps the safe default.
    }
  }, []);
  const change = (on: boolean) => {
    setBlur(on);
    try {
      localStorage.setItem(KEY, on ? 'on' : 'off');
    } catch {
      // Blocked storage only loses the remembered choice.
    }
  };
  return <BlurContext.Provider value={{ blur, change }}>{children}</BlurContext.Provider>;
}

export function BlurToggle() {
  const { blur, change } = useContext(BlurContext);
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm whitespace-nowrap">
      <input type="checkbox" checked={blur} onChange={e => change(e.target.checked)} className="size-4 accent-accent" />
      Blur spoilers
    </label>
  );
}

export function SpoilerImage({ src, spoiler, className = '', label = 'Spoiler', sizes }: { src: string; spoiler: boolean; className?: string; label?: string; sizes: string }) {
  const { blur } = useContext(BlurContext);
  const [shown, setShown] = useState(false);
  const hidden = spoiler && blur && !shown;
  return (
    <div className={`relative overflow-hidden rounded-image ${className}`}>
      <Image src={src} alt="" fill sizes={sizes} className={`object-cover ${hidden ? 'scale-110 blur-xl' : ''}`} />
      {hidden && (
        <button type="button" onClick={e => { e.preventDefault(); setShown(true); }} className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-bg/70 text-[15px] font-semibold">
          {label}
          <span className="text-sm text-accent">Show</span>
        </button>
      )}
    </div>
  );
}
