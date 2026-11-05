'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useT } from '@/i18n/t';
import type { Video } from '@/server/wiki/queries';

// The player loads on click, so a page full of videos costs one thumbnail each and sets no YouTube cookies.
export function VideoCard({ video, sizes = '(min-width: 1024px) 30vw, 100vw' }: { video: Video; sizes?: string }) {
  const t = useT();
  const [playing, setPlaying] = useState(false);
  return (
    <article className="flex flex-col gap-2">
      <div className="relative aspect-video overflow-hidden rounded-image bg-surface">
        {playing ? (
          <iframe src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0`} title={video.title} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen className="absolute inset-0 size-full" />
        ) : (
          <button type="button" onClick={() => setPlaying(true)} aria-label={t('Play {title}', { title: video.title })} className="group absolute inset-0">
            <Image src={`https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg`} alt="" fill sizes={sizes} className="object-cover" />
            <span aria-hidden="true" className="absolute bottom-2 left-2 flex size-10 items-center justify-center rounded-control bg-black/75 text-white group-hover:bg-accent">
              <svg viewBox="0 0 24 24" className="size-5 fill-current"><path d="M8 5v14l11-7z" /></svg>
            </span>
          </button>
        )}
      </div>
      <h3 className="font-ui text-[15px] leading-snug font-semibold">{video.title}</h3>
      <p className="flex items-center gap-2 text-[13px] text-muted">
        {video.game && <span>{video.game}</span>}
        <a href={`https://www.youtube.com/watch?v=${video.youtubeId}`} target="_blank" rel="noopener noreferrer" className="hover:text-text">{t('Watch on YouTube')}</a>
      </p>
    </article>
  );
}
