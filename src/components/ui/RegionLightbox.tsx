'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Box, IconButton, Typography } from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';

interface RegionLightboxProps {
  open: boolean;
  images: string[];
  title: string;
  onClose: () => void;
}

// Floating region carousel. Blurs the whole page behind a scrim; supports
// keyboard (Esc / ← / →), arrows, dots and a counter. Mounts only when open.
export default function RegionLightbox({ open, images, title, onClose }: RegionLightboxProps) {
  const [index, setIndex] = useState(0);
  const closeRef = useRef<HTMLButtonElement>(null);
  const count = images.length;
  const multiple = count > 1;

  const next = useCallback(() => setIndex((i) => (i + 1) % count), [count]);
  const prev = useCallback(() => setIndex((i) => (i - 1 + count) % count), [count]);

  // Reset to the first image whenever a new region is opened.
  useEffect(() => {
    if (open) setIndex(0);
  }, [open, title]);

  // Lock body scroll + wire keyboard shortcuts while open.
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') next();
      else if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, next, prev, onClose]);

  if (!open || typeof document === 'undefined') return null;

  return createPortal(
    <Box
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
      sx={{
        position: 'fixed',
        inset: 0,
        zIndex: 2000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: { xs: 2, md: 4 },
        background: 'rgba(5,4,10,0.72)',
        backdropFilter: 'blur(16px)',
        animation: 'fadeUp 0.28s var(--ease-out)',
      }}
    >
      {/* Header: title + counter + close */}
      <Box
        onClick={(e) => e.stopPropagation()}
        sx={{
          width: '100%',
          maxWidth: 1200,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 2,
        }}
      >
        <Box>
          <Typography className="gta-display" sx={{ fontSize: { xs: '1.5rem', md: '2rem' }, color: '#fff', lineHeight: 1 }}>
            {title}
          </Typography>
          {multiple && (
            <Typography className="font-mono" sx={{ color: 'var(--c-teal)', fontSize: '0.8rem', mt: 0.5 }}>
              {String(index + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
            </Typography>
          )}
        </Box>
        <IconButton
          ref={closeRef}
          onClick={onClose}
          aria-label="Close gallery"
          sx={{
            color: '#fff',
            border: '1px solid var(--hairline-strong)',
            background: 'rgba(255,255,255,0.06)',
            '&:hover': { background: 'rgba(255,30,122,0.2)', borderColor: 'var(--c-magenta)' },
          }}
        >
          <CloseRoundedIcon />
        </IconButton>
      </Box>

      {/* Stage */}
      <Box
        onClick={(e) => e.stopPropagation()}
        sx={{
          position: 'relative',
          width: '100%',
          maxWidth: 1200,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {multiple && (
          <IconButton
            onClick={prev}
            aria-label="Previous image"
            sx={{
              position: 'absolute',
              left: { xs: 4, md: -8 },
              zIndex: 2,
              color: '#fff',
              background: 'rgba(5,4,10,0.6)',
              border: '1px solid var(--hairline-strong)',
              '&:hover': { background: 'var(--c-magenta)' },
            }}
          >
            <ChevronLeftRoundedIcon fontSize="large" />
          </IconButton>
        )}

        <Box
          component="img"
          src={images[index]}
          alt={`${title} ${index + 1}`}
          sx={{
            width: '100%',
            maxHeight: '72vh',
            objectFit: 'contain',
            borderRadius: 'var(--r-md)',
            border: '1px solid var(--hairline-strong)',
            boxShadow: '0 30px 80px rgba(0,0,0,0.6), 0 0 40px rgba(255,30,122,0.18)',
            background: '#05040a',
          }}
        />

        {multiple && (
          <IconButton
            onClick={next}
            aria-label="Next image"
            sx={{
              position: 'absolute',
              right: { xs: 4, md: -8 },
              zIndex: 2,
              color: '#fff',
              background: 'rgba(5,4,10,0.6)',
              border: '1px solid var(--hairline-strong)',
              '&:hover': { background: 'var(--c-magenta)' },
            }}
          >
            <ChevronRightRoundedIcon fontSize="large" />
          </IconButton>
        )}
      </Box>

      {/* Dots */}
      {multiple && (
        <Box
          onClick={(e) => e.stopPropagation()}
          sx={{ display: 'flex', gap: 1, mt: 2.5, flexWrap: 'wrap', justifyContent: 'center' }}
        >
          {images.map((_, i) => (
            <Box
              key={i}
              component="button"
              onClick={() => setIndex(i)}
              aria-label={`Go to image ${i + 1}`}
              sx={{
                width: i === index ? 26 : 10,
                height: 10,
                p: 0,
                border: 'none',
                borderRadius: 'var(--r-pill)',
                cursor: 'pointer',
                transition: 'all 0.3s var(--ease-out)',
                background: i === index ? 'var(--grad-hot)' : 'rgba(255,255,255,0.35)',
                boxShadow: i === index ? '0 0 10px rgba(255,30,122,0.7)' : 'none',
              }}
            />
          ))}
        </Box>
      )}
    </Box>,
    document.body
  );
}
