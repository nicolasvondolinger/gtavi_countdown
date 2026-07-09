'use client';

import { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { asset } from '@/lib/asset';

// Cinematic crossfading backdrop, scoped to its (position: relative) parent —
// used behind the hero. A slow Ken Burns zoom adds life without distracting.
const IMAGES = [
  asset('media/bg/hero.webp'),
  asset('media/bg/motel.webp'),
  asset('media/bg/duo3.webp'),
  asset('media/bg/cover.webp'),
];

export default function BackgroundSlideshow() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % IMAGES.length), 7000);
    return () => clearInterval(id);
  }, []);

  return (
    <Box aria-hidden sx={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 0 }}>
      {IMAGES.map((src, i) => (
        <Box
          key={src}
          component="img"
          src={src}
          alt=""
          loading={i === 0 ? 'eager' : 'lazy'}
          sx={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center 30%',
            opacity: i === index ? 1 : 0,
            transform: i === index ? 'scale(1.08)' : 'scale(1)',
            transition: 'opacity 1.6s ease-in-out, transform 8s ease-out',
            filter: 'saturate(1.05) brightness(0.82)',
          }}
        />
      ))}
      {/* Readability + brand tint */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(7,6,13,0.55), rgba(7,6,13,0.35) 40%, rgba(7,6,13,0.85)), radial-gradient(120% 80% at 50% 0%, rgba(157,78,221,0.25), transparent 55%)',
        }}
      />
    </Box>
  );
}
