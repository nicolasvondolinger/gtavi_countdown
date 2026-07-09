'use client';

import { useState } from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Countdown from '@/components/Countdown';
import TimezoneSelector from '@/components/TimezoneSelector';
import CalendarButton from '@/components/CalendarButton';
import BackgroundSlideshow from '@/components/BackgroundSlideshow';
import WhatsAppButton from '@/components/ui/WhatsAppButton';
import { useLanguage } from '@/hooks/useLanguage';
import { asset } from '@/lib/asset';
import { PRE_ORDER_URL } from '@/lib/site';

export default function Hero() {
  const { translations: t } = useLanguage();
  const [timezone, setTimezone] = useState('Europe/London');

  return (
    <Box
      component="section"
      id="countdown"
      sx={{
        position: 'relative',
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        pt: 'calc(var(--nav-h) + 24px)',
        pb: { xs: 10, md: 8 },
        textAlign: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Cinematic backdrop (scoped to the hero) */}
      <BackgroundSlideshow />
      {/* Synthwave floor grid */}
      <Box className="synthwave-grid" aria-hidden sx={{ zIndex: 1 }} />
      {/* Bottom scrim to seat content over the photo */}
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          background:
            'radial-gradient(90% 60% at 50% 40%, transparent 40%, rgba(7,6,13,0.5) 100%), linear-gradient(180deg, rgba(7,6,13,0.35), rgba(7,6,13,0.1) 45%, rgba(7,6,13,0.85))',
          pointerEvents: 'none',
        }}
      />

      <Box
        sx={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          maxWidth: 940,
          borderRadius: 'var(--r-lg)',
          p: { xs: 3, sm: 5, md: 6 },
          background: 'rgba(9,8,16,0.55)',
          backdropFilter: 'blur(14px)',
          border: '1px solid var(--hairline)',
          boxShadow: '0 30px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)',
        }}
      >
        {/* Gradient top hairline */}
        <Box
          aria-hidden
          sx={{
            position: 'absolute',
            top: 0,
            left: '10%',
            right: '10%',
            height: 2,
            background: 'var(--grad-brand)',
            opacity: 0.8,
          }}
        />

        <Typography
          className="font-kicker"
          sx={{ color: 'var(--c-teal)', fontSize: { xs: '0.8rem', md: '0.95rem' }, mb: 2 }}
        >
          {t.heroKicker}
        </Typography>

        <Box
          component="img"
          src={asset('assets/gta-logo.png')}
          alt="Grand Theft Auto VI"
          sx={{
            width: { xs: '78%', sm: '62%' },
            maxWidth: 420,
            mb: { xs: 2.5, md: 3 },
            filter: 'drop-shadow(0 0 24px rgba(255,30,122,0.45))',
            animation: 'pulseGlow 5s ease-in-out infinite',
          }}
        />

        <Typography
          sx={{
            color: 'var(--text-mid)',
            maxWidth: 560,
            mx: 'auto',
            mb: 1,
            fontSize: { xs: '0.95rem', md: '1.05rem' },
          }}
        >
          {t.heroTagline}
        </Typography>
        <Typography
          className="font-mono"
          sx={{ color: 'var(--c-pink)', fontSize: '0.8rem', mb: { xs: 3, md: 4 }, letterSpacing: '0.02em' }}
        >
          {t.worldwideRelease}
        </Typography>

        <Countdown timezone={timezone} />

        <TimezoneSelector selectedTimezone={timezone} onTimezoneChange={setTimezone} />

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          justifyContent="center"
          alignItems="center"
          sx={{ mt: { xs: 3, md: 4 } }}
        >
          <Button
            href={PRE_ORDER_URL}
            target="_blank"
            rel="noopener noreferrer"
            variant="contained"
            color="primary"
            size="large"
            sx={{ px: 4, py: 1.6, fontSize: '1.05rem', borderRadius: 'var(--r-pill)', width: { xs: '100%', sm: 'auto' } }}
          >
            {t.purchase}
          </Button>
          <CalendarButton
            variant="outlined"
            startIcon={<EventIcon />}
            sx={{ px: 3.5, py: 1.6, fontSize: '1.05rem', borderRadius: 'var(--r-pill)', width: { xs: '100%', sm: 'auto' } }}
          />
          <WhatsAppButton
            sx={{ px: 3.5, py: 1.6, fontSize: '1.05rem', width: { xs: '100%', sm: 'auto' } }}
          />
        </Stack>
      </Box>

      {/* Scroll hint */}
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          zIndex: 2,
          bottom: 22,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 0.5,
          color: 'var(--text-lo)',
        }}
      >
        <Typography className="font-kicker" sx={{ fontSize: '0.62rem' }}>
          {t.scrollHint}
        </Typography>
        <KeyboardArrowDownIcon sx={{ animation: 'scrollHint 1.8s ease-in-out infinite' }} />
      </Box>
    </Box>
  );
}
