'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { useT } from '@/i18n/t';

export function Gallery({ images, title }: { images: string[]; title: string }) {
  const t = useT();
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState<number | null>(null);
  // Posters and covers would lose their heads in a wide tile, so they show whole.
  const [tall, setTall] = useState<string[]>([]);

  useEffect(() => {
    if (open !== null) dialog.current?.showModal();
    else dialog.current?.close();
  }, [open]);

  if (images.length === 0) return null;
  const step = (by: number) => setOpen(i => ((i ?? 0) + by + images.length) % images.length);
  const shown = open === null ? null : images[open];

  return (
    <section id="gallery" aria-label={t('Gallery')} className="flex scroll-mt-6 flex-col gap-3">
      <h2 className="text-[26px]">{t('Gallery')}</h2>
      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {images.map((src, i) => (
          <li key={src} className={i === 0 ? 'col-span-2 sm:row-span-2' : ''}>
            <button type="button" onClick={() => setOpen(i)} aria-label={t('Open image {n} of {total}', { n: i + 1, total: images.length })} className={`group relative block aspect-video w-full overflow-hidden rounded-image bg-surface ${i === 0 ? 'sm:aspect-auto sm:h-full' : ''}`}>
              <Image src={`/media/${src}`} alt={title} fill onLoad={e => e.currentTarget.naturalHeight >= e.currentTarget.naturalWidth * 0.9 && setTall(list => [...list, src])} sizes={i === 0 ? '(min-width: 1024px) 440px, 100vw' : '(min-width: 1024px) 220px, 50vw'} className={`${tall.includes(src) ? 'object-contain' : 'object-cover'} transition-opacity duration-150 group-hover:opacity-85`} />
            </button>
          </li>
        ))}
      </ul>
      <dialog
        ref={dialog}
        aria-label={title}
        onClose={() => setOpen(null)}
        onKeyDown={e => {
          if (e.key === 'ArrowRight') step(1);
          if (e.key === 'ArrowLeft') step(-1);
        }}
        className="m-auto size-full max-h-none max-w-none bg-transparent backdrop:bg-black/90"
      >
        {shown && (
          <div className="relative size-full">
            <Image src={`/media/${shown}`} alt={title} fill sizes="100vw" className="object-contain" />
            <button type="button" onClick={() => setOpen(null)} aria-label={t('Close')} className="absolute top-4 right-4 rounded-control bg-black/70 p-2 text-white"><Icon name="close" /></button>
            {images.length > 1 && (
              <>
                <button type="button" onClick={() => step(-1)} aria-label={t('Previous image')} className="absolute top-1/2 left-4 -translate-y-1/2 rounded-control bg-black/70 p-2 text-white"><Icon name="chevronRight" className="rotate-180" /></button>
                <button type="button" onClick={() => step(1)} aria-label={t('Next image')} className="absolute top-1/2 right-4 -translate-y-1/2 rounded-control bg-black/70 p-2 text-white"><Icon name="chevronRight" /></button>
                <p className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-control bg-black/70 px-2 py-1 font-data text-xs text-white">{(open ?? 0) + 1} / {images.length}</p>
              </>
            )}
          </div>
        )}
      </dialog>
    </section>
  );
}
