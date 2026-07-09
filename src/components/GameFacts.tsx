'use client';

import { Box, Typography } from '@mui/material';
import EventAvailableRoundedIcon from '@mui/icons-material/EventAvailableRounded';
import SportsEsportsRoundedIcon from '@mui/icons-material/SportsEsportsRounded';
import ApartmentRoundedIcon from '@mui/icons-material/ApartmentRounded';
import PlaceRoundedIcon from '@mui/icons-material/PlaceRounded';
import PublicRoundedIcon from '@mui/icons-material/PublicRounded';
import LocalOfferRoundedIcon from '@mui/icons-material/LocalOfferRounded';
import type { SvgIconComponent } from '@mui/icons-material';
import { useLanguage } from '@/hooks/useLanguage';
import { GAME_FACTS } from '@/lib/site';
import SectionHeader from '@/components/ui/SectionHeader';
import Reveal from '@/components/ui/Reveal';

export default function GameFacts() {
  const { translations: t } = useLanguage();

  const facts: { icon: SvgIconComponent; label: string; value: string }[] = [
    { icon: EventAvailableRoundedIcon, label: t.facts.release, value: GAME_FACTS.releaseValue },
    { icon: SportsEsportsRoundedIcon, label: t.facts.platforms, value: GAME_FACTS.platformsValue },
    { icon: ApartmentRoundedIcon, label: t.facts.studio, value: GAME_FACTS.studioValue },
    { icon: PlaceRoundedIcon, label: t.facts.setting, value: GAME_FACTS.settingValue },
    { icon: PublicRoundedIcon, label: t.facts.mode, value: GAME_FACTS.enginePlayValue },
    { icon: LocalOfferRoundedIcon, label: t.facts.editions, value: GAME_FACTS.editionsValue },
  ];

  return (
    <Box
      component="section"
      id="facts"
      sx={{ px: { xs: 2, md: 4 }, py: { xs: 7, md: 11 }, maxWidth: 1180, mx: 'auto' }}
    >
      <SectionHeader kicker="The Game" title={t.factsTitle} subtitle={t.factsSubtitle} />

      <Box
        sx={{
          display: 'grid',
          gap: { xs: 1.75, md: 2.25 },
          gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
        }}
      >
        {facts.map(({ icon: Icon, label, value }, i) => (
          <Reveal key={label} delay={i * 60} sx={{ display: 'flex' }}>
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                p: { xs: 2.25, md: 3 },
                borderRadius: 'var(--r-md)',
                background: 'var(--surface)',
                border: '1px solid var(--hairline)',
                backdropFilter: 'blur(8px)',
                overflow: 'hidden',
                transition: 'transform 0.25s var(--ease-out), border-color 0.25s ease',
                '&:hover': { transform: 'translateY(-4px)', borderColor: 'rgba(45,226,230,0.5)' },
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  inset: 0,
                  background: 'radial-gradient(120% 100% at 100% 0%, rgba(45,226,230,0.1), transparent 60%)',
                  pointerEvents: 'none',
                },
              }}
            >
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  mb: 2,
                  borderRadius: 'var(--r-sm)',
                  display: 'grid',
                  placeItems: 'center',
                  color: 'var(--c-teal)',
                  background: 'rgba(45,226,230,0.1)',
                  border: '1px solid rgba(45,226,230,0.3)',
                }}
              >
                <Icon fontSize="small" />
              </Box>
              <Typography className="font-kicker" sx={{ color: 'var(--text-lo)', fontSize: '0.7rem', mb: 0.75 }}>
                {label}
              </Typography>
              <Typography sx={{ fontWeight: 700, color: '#fff', fontSize: { xs: '1rem', md: '1.15rem' }, lineHeight: 1.25 }}>
                {value}
              </Typography>
            </Box>
          </Reveal>
        ))}
      </Box>
    </Box>
  );
}
