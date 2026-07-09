'use client';

import { Box, Typography } from '@mui/material';
import Reveal from './Reveal';

interface SectionHeaderProps {
  kicker: string;
  title: string;
  subtitle?: string;
  align?: 'center' | 'left';
}

// Consistent section intro: neon kicker rule + display title + optional subtitle.
export default function SectionHeader({
  kicker,
  title,
  subtitle,
  align = 'center',
}: SectionHeaderProps) {
  const centered = align === 'center';
  return (
    <Reveal
      sx={{
        textAlign: align,
        mb: { xs: 4, md: 6 },
        mx: centered ? 'auto' : 0,
        maxWidth: 760,
      }}
    >
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 1.5,
          mb: 2,
          justifyContent: centered ? 'center' : 'flex-start',
        }}
      >
        <Box sx={{ width: 28, height: 2, background: 'var(--grad-hot)' }} />
        <Typography
          component="span"
          className="font-kicker"
          sx={{ color: 'var(--c-teal)', fontSize: '0.85rem' }}
        >
          {kicker}
        </Typography>
        <Box sx={{ width: 28, height: 2, background: 'var(--grad-hot)' }} />
      </Box>
      <Typography
        variant="h2"
        className="gta-display"
        sx={{
          fontSize: { xs: '2.4rem', sm: '3.2rem', md: '3.8rem' },
          color: '#fff',
          textShadow: '0 0 30px rgba(255,30,122,0.35)',
        }}
      >
        {title}
      </Typography>
      {subtitle && (
        <Typography
          sx={{
            mt: 2,
            color: 'var(--text-mid)',
            fontSize: { xs: '1rem', md: '1.1rem' },
            maxWidth: 620,
            mx: centered ? 'auto' : 0,
          }}
        >
          {subtitle}
        </Typography>
      )}
    </Reveal>
  );
}
