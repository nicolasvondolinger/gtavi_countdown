'use client';

import { Box, Typography } from '@mui/material';
import { useLanguage } from '@/hooks/useLanguage';
import { TRAILERS } from '@/lib/site';
import SectionHeader from '@/components/ui/SectionHeader';
import Reveal from '@/components/ui/Reveal';

export default function Trailers() {
  const { translations: t } = useLanguage();

  return (
    <Box
      component="section"
      id="trailers"
      sx={{ px: { xs: 2, md: 4 }, py: { xs: 7, md: 11 }, maxWidth: 1180, mx: 'auto' }}
    >
      <SectionHeader kicker="Watch" title={t.trailers} subtitle={t.trailersSubtitle} />

      <Box
        sx={{
          display: 'grid',
          gap: { xs: 2.5, md: 3 },
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
        }}
      >
        {TRAILERS.map((trailer, i) => (
          <Reveal key={trailer.id} delay={i * 100}>
            <Box
              sx={{
                position: 'relative',
                borderRadius: 'var(--r-md)',
                overflow: 'hidden',
                border: '1px solid var(--hairline)',
                boxShadow: '0 14px 40px rgba(0,0,0,0.4)',
                transition: 'transform 0.3s var(--ease-out), box-shadow 0.3s ease, border-color 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  borderColor: 'rgba(255,30,122,0.5)',
                  boxShadow: '0 20px 50px rgba(255,30,122,0.25)',
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 3,
                  zIndex: 1,
                  background: 'var(--grad-brand)',
                },
              }}
            >
              <Box
                component="iframe"
                src={`https://www.youtube.com/embed/${trailer.id}`}
                title={`GTA VI Trailer ${i + 1}`}
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                sx={{ width: '100%', aspectRatio: '16 / 9', border: 'none', display: 'block' }}
              />
            </Box>
            <Typography
              className="font-mono"
              sx={{ mt: 1.5, textAlign: 'center', color: 'var(--text-mid)', fontSize: '0.85rem' }}
            >
              GTA VI · Trailer {i + 1}
            </Typography>
          </Reveal>
        ))}
      </Box>
    </Box>
  );
}
