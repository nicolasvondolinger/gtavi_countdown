'use client';

import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import CollectionsRoundedIcon from '@mui/icons-material/CollectionsRounded';
import ZoomInRoundedIcon from '@mui/icons-material/ZoomInRounded';
import { useLanguage } from '@/hooks/useLanguage';
import { asset } from '@/lib/asset';
import { WORLD_REGIONS } from '@/lib/site';
import SectionHeader from '@/components/ui/SectionHeader';
import Reveal from '@/components/ui/Reveal';
import RegionLightbox from '@/components/ui/RegionLightbox';

export default function WorldGallery() {
  const { translations: t } = useLanguage();
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const active = openIdx !== null ? WORLD_REGIONS[openIdx] : null;
  const activeLoc = openIdx !== null ? t.locations[openIdx] : null;

  return (
    <Box
      component="section"
      id="world"
      sx={{ px: { xs: 2, md: 4 }, py: { xs: 7, md: 11 }, maxWidth: 1240, mx: 'auto' }}
    >
      <SectionHeader kicker="Leonida" title={t.worldTitle} subtitle={t.worldSubtitle} />

      {/* Two equal, centered columns */}
      <Box
        sx={{
          display: 'grid',
          gap: { xs: 1.75, md: 2.5 },
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
          maxWidth: 980,
          mx: 'auto',
        }}
      >
        {t.locations.map((loc, i) => {
          const region = WORLD_REGIONS[i];
          const count = region.images.length;
          return (
            <Reveal key={loc.name} delay={(i % 2) * 90} sx={{ display: 'flex' }}>
              <Box
                component="button"
                onClick={() => setOpenIdx(i)}
                aria-label={`${loc.name} — ${count} ${count > 1 ? 'photos' : 'photo'}`}
                sx={{
                  position: 'relative',
                  width: '100%',
                  p: 0,
                  border: '1px solid var(--hairline)',
                  borderRadius: 'var(--r-md)',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  aspectRatio: '16 / 10',
                  background: 'none',
                  transition: 'transform 0.3s var(--ease-out), border-color 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    borderColor: 'rgba(255,30,122,0.6)',
                    boxShadow: '0 18px 44px rgba(0,0,0,0.45), 0 0 22px rgba(255,30,122,0.25)',
                  },
                  '&:hover img': { transform: 'scale(1.07)' },
                  '&:hover .wg-zoom': { opacity: 1, transform: 'scale(1)' },
                }}
              >
                <Box
                  component="img"
                  src={asset(region.images[0])}
                  alt={loc.name}
                  loading="lazy"
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.6s var(--ease-out)',
                  }}
                />
                <Box
                  aria-hidden
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    background:
                      'linear-gradient(180deg, rgba(7,6,13,0.05) 30%, rgba(7,6,13,0.4) 60%, rgba(7,6,13,0.94) 100%)',
                  }}
                />

                {/* Photo count badge */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.75,
                    px: 1.25,
                    py: 0.5,
                    borderRadius: 'var(--r-pill)',
                    background: 'rgba(5,4,10,0.6)',
                    backdropFilter: 'blur(6px)',
                    border: '1px solid var(--hairline-strong)',
                    color: '#fff',
                  }}
                >
                  <CollectionsRoundedIcon sx={{ fontSize: 15 }} />
                  <Typography className="font-mono" sx={{ fontSize: '0.72rem', lineHeight: 1 }}>
                    {count}
                  </Typography>
                </Box>

                {/* Zoom hint */}
                <Box
                  className="wg-zoom"
                  aria-hidden
                  sx={{
                    position: 'absolute',
                    top: '42%',
                    left: '50%',
                    transform: 'translate(-50%,-50%) scale(0.8)',
                    opacity: 0,
                    width: 52,
                    height: 52,
                    borderRadius: '50%',
                    display: 'grid',
                    placeItems: 'center',
                    color: '#fff',
                    background: 'var(--grad-hot)',
                    boxShadow: '0 0 22px rgba(255,30,122,0.7)',
                    transition: 'opacity 0.3s ease, transform 0.3s var(--ease-out)',
                  }}
                >
                  <ZoomInRoundedIcon />
                </Box>

                <Box sx={{ position: 'absolute', left: 0, right: 0, bottom: 0, p: { xs: 2, md: 2.5 }, textAlign: 'left' }}>
                  <Typography
                    className="gta-display"
                    sx={{ fontSize: { xs: '1.6rem', md: '2.1rem' }, color: '#fff', textShadow: '0 2px 20px rgba(0,0,0,0.7)', lineHeight: 1 }}
                  >
                    {loc.name}
                  </Typography>
                  <Typography className="font-mono" sx={{ mt: 0.75, fontSize: '0.78rem', color: 'var(--c-teal)' }}>
                    {loc.tag}
                  </Typography>
                </Box>
              </Box>
            </Reveal>
          );
        })}
      </Box>

      <RegionLightbox
        open={active !== null}
        images={active ? active.images.map((p) => asset(p)) : []}
        title={activeLoc ? activeLoc.name : ''}
        onClose={() => setOpenIdx(null)}
      />
    </Box>
  );
}
