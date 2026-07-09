'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Box, Typography } from '@mui/material';
import { RELEASE_ISO } from '@/lib/site';

// Single global instant. The game launches at the same moment everywhere, so
// the countdown is identical for every visitor; the timezone only changes how
// the local release date/time is displayed.
export const RELEASE_INSTANT = new Date(RELEASE_ISO);

interface CountdownProps {
  timezone: string;
}

function diffToParts(ms: number) {
  return {
    days: Math.floor(ms / (1000 * 60 * 60 * 24)),
    hours: Math.floor((ms / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((ms / (1000 * 60)) % 60),
    seconds: Math.floor((ms / 1000) % 60),
  };
}

function Unit({ value, label, wide }: { value: number; label: string; wide?: boolean }) {
  return (
    <Box
      sx={{
        flex: wide ? '1 1 108px' : '1 1 92px',
        maxWidth: 168,
        minWidth: 78,
        position: 'relative',
        py: { xs: 2, sm: 2.75 },
        px: 1,
        borderRadius: 'var(--r-md)',
        background: 'linear-gradient(165deg, rgba(24,20,38,0.9), rgba(40,16,42,0.82))',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow:
          'inset 0 1px 0 rgba(255,255,255,0.08), inset 0 0 24px rgba(157,78,221,0.16), 0 12px 30px rgba(0,0,0,0.45)',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: 'var(--grad-brand)',
          opacity: 0.9,
        },
      }}
    >
      <Typography
        component="span"
        className="font-mono"
        sx={{
          display: 'block',
          fontWeight: 700,
          fontSize: { xs: '2.5rem', sm: '3.6rem', md: '4rem' },
          lineHeight: 1,
          color: '#fff',
          textShadow: '0 0 14px rgba(255,30,122,0.75), 0 0 34px rgba(157,78,221,0.45)',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {label === 'days' ? value : String(value).padStart(2, '0')}
      </Typography>
      <Typography
        className="font-kicker"
        sx={{
          mt: 1,
          fontSize: { xs: '0.62rem', sm: '0.72rem' },
          color: 'var(--text-lo)',
        }}
      >
        {label}
      </Typography>
    </Box>
  );
}

export default function Countdown({ timezone }: CountdownProps) {
  const { translations, locale } = useLanguage();
  const [timeLeft, setTimeLeft] = useState(diffToParts(0));
  const [released, setReleased] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const tick = () => {
      const diff = RELEASE_INSTANT.getTime() - Date.now();
      if (diff <= 0) {
        setReleased(true);
        setTimeLeft(diffToParts(0));
        return true;
      }
      setTimeLeft(diffToParts(diff));
      return false;
    };

    if (tick()) return;
    const timer = setInterval(() => {
      if (tick()) clearInterval(timer);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  let localRelease = '';
  try {
    localRelease = new Intl.DateTimeFormat(locale, {
      dateStyle: 'full',
      timeStyle: 'short',
      timeZone: timezone,
    }).format(RELEASE_INSTANT);
  } catch {
    localRelease = RELEASE_INSTANT.toUTCString();
  }

  if (released) {
    return (
      <Box sx={{ py: { xs: 3, sm: 4 } }}>
        <Typography
          component="p"
          className="gta-display"
          sx={{
            fontSize: { xs: '3rem', sm: '5rem' },
            color: 'transparent',
            background: 'var(--grad-brand)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            filter: 'drop-shadow(0 0 24px rgba(255,30,122,0.8))',
          }}
        >
          {translations.released}
        </Typography>
        <Typography variant="h6" sx={{ mt: 2, color: 'var(--text-mid)' }}>
          {translations.releasedSubtitle}
        </Typography>
      </Box>
    );
  }

  const labels: Array<'days' | 'hours' | 'minutes' | 'seconds'> = [
    'days',
    'hours',
    'minutes',
    'seconds',
  ];

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: { xs: 1.25, sm: 2 },
          // Avoid a layout flash before the client clock hydrates.
          visibility: mounted ? 'visible' : 'hidden',
        }}
      >
        {labels.map((label) => (
          <Unit
            key={label}
            value={timeLeft[label]}
            label={label}
            wide={label === 'days'}
          />
        ))}
      </Box>

      <Typography
        variant="body2"
        sx={{ mt: { xs: 2.5, sm: 3 }, color: 'var(--text-mid)' }}
      >
        {translations.inYourTimezone}:{' '}
        <Box component="strong" sx={{ color: 'var(--text-hi)' }}>
          {localRelease}
        </Box>
      </Typography>
    </Box>
  );
}
