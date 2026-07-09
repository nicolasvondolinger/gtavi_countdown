'use client';

import { Box, Typography, Button, Chip, Stack } from '@mui/material';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import RedeemRoundedIcon from '@mui/icons-material/RedeemRounded';
import SportsEsportsRoundedIcon from '@mui/icons-material/SportsEsportsRounded';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import { useLanguage } from '@/hooks/useLanguage';
import { PRE_ORDER_URL, EDITION_PRICES } from '@/lib/site';
import { asset } from '@/lib/asset';
import SectionHeader from '@/components/ui/SectionHeader';
import Reveal from '@/components/ui/Reveal';

function EditionCard({
  image,
  title,
  price,
  description,
  features,
  highlight,
  badge,
  cta,
  delay,
}: {
  image: string;
  title: string;
  price: string;
  description: string;
  features: string[];
  highlight: boolean;
  badge?: string;
  cta: string;
  delay: number;
}) {
  return (
    <Reveal delay={delay} sx={{ display: 'flex' }}>
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 'var(--r-lg)',
          overflow: 'hidden',
          background: 'var(--surface)',
          border: highlight ? '1.5px solid var(--c-magenta)' : '1px solid var(--hairline)',
          boxShadow: highlight ? '0 20px 60px rgba(255,30,122,0.32)' : '0 14px 40px rgba(0,0,0,0.35)',
          backdropFilter: 'blur(10px)',
          transition: 'transform 0.3s var(--ease-out), box-shadow 0.3s ease',
          '&:hover': { transform: 'translateY(-6px)' },
        }}
      >
        {badge && (
          <Chip
            label={badge}
            size="small"
            sx={{
              position: 'absolute',
              top: 14,
              right: 14,
              zIndex: 2,
              fontWeight: 700,
              letterSpacing: '0.05em',
              color: '#fff',
              background: 'var(--grad-hot)',
              boxShadow: '0 0 16px rgba(255,30,122,0.8)',
            }}
          />
        )}

        <Box sx={{ position: 'relative', aspectRatio: '16 / 9', overflow: 'hidden' }}>
          <Box
            component="img"
            src={image}
            alt={title}
            loading="lazy"
            sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <Box
            aria-hidden
            sx={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg, transparent 40%, rgba(18,16,28,0.85) 100%)',
            }}
          />
        </Box>

        <Box sx={{ p: { xs: 3, md: 3.5 }, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: 0.5 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#fff' }}>
              {title}
            </Typography>
            <Typography
              className="gta-display"
              sx={{
                fontSize: '2rem',
                background: 'var(--grad-brand)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              {price}
            </Typography>
          </Stack>

          <Typography variant="body2" sx={{ color: 'var(--text-mid)', mb: 2.5 }}>
            {description}
          </Typography>

          <Stack spacing={1.25} sx={{ mb: 3, flexGrow: 1 }}>
            {features.map((f) => (
              <Stack key={f} direction="row" spacing={1.25} alignItems="center">
                <CheckCircleRoundedIcon
                  fontSize="small"
                  sx={{ color: highlight ? 'var(--c-magenta)' : 'var(--c-teal)', flexShrink: 0 }}
                />
                <Typography variant="body2" sx={{ color: 'var(--text-hi)' }}>
                  {f}
                </Typography>
              </Stack>
            ))}
          </Stack>

          <Button
            href={PRE_ORDER_URL}
            target="_blank"
            rel="noopener noreferrer sponsored"
            variant={highlight ? 'contained' : 'outlined'}
            color="primary"
            fullWidth
            sx={{ py: 1.3, borderRadius: 'var(--r-pill)', fontSize: '1rem' }}
          >
            {cta}
          </Button>
        </Box>
      </Box>
    </Reveal>
  );
}

export default function PreOrderSection() {
  const { translations: t } = useLanguage();

  return (
    <Box
      component="section"
      id="editions"
      sx={{ px: { xs: 2, md: 4 }, py: { xs: 7, md: 11 }, maxWidth: 1100, mx: 'auto' }}
    >
      <SectionHeader kicker="Editions" title={t.preOrderTitle} subtitle={t.preOrderSubtitle} />

      <Box
        sx={{
          display: 'grid',
          gap: { xs: 2.5, md: 3 },
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
          alignItems: 'stretch',
        }}
      >
        <EditionCard
          image={asset('media/editions/standard.webp')}
          title={t.editionStandard}
          price={EDITION_PRICES.standard}
          description={t.editionStandardDesc}
          features={t.editionStandardFeatures}
          highlight={false}
          cta={t.purchase}
          delay={0}
        />
        <EditionCard
          image={asset('media/editions/ultimate.webp')}
          title={t.editionUltimate}
          price={EDITION_PRICES.ultimate}
          description={t.editionUltimateDesc}
          features={t.editionUltimateFeatures}
          highlight
          badge={t.mostPopular}
          cta={t.purchase}
          delay={100}
        />
      </Box>

      {/* Pre-order bonus */}
      <Reveal delay={80}>
        <Box
          sx={{
            mt: { xs: 2.5, md: 3 },
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '200px 1fr' },
            gap: { xs: 2, sm: 3 },
            alignItems: 'center',
            p: { xs: 2.5, md: 3 },
            borderRadius: 'var(--r-lg)',
            background: 'linear-gradient(135deg, rgba(255,30,122,0.12), rgba(255,149,71,0.12))',
            border: '1px solid var(--hairline)',
          }}
        >
          <Box
            component="img"
            src={asset('media/editions/vintage.webp')}
            alt={t.bonusVintage}
            loading="lazy"
            sx={{
              width: '100%',
              aspectRatio: '16 / 9',
              objectFit: 'cover',
              borderRadius: 'var(--r-md)',
              border: '1px solid var(--hairline)',
            }}
          />
          <Box>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
              <RedeemRoundedIcon sx={{ color: 'var(--c-orange)' }} />
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#fff' }}>
                {t.bonusTitle}
              </Typography>
            </Stack>
            <Stack spacing={1}>
              <Stack direction="row" spacing={1} alignItems="center">
                <CheckCircleRoundedIcon fontSize="small" sx={{ color: 'var(--success, #4ade80)' }} />
                <Typography variant="body2" sx={{ color: 'var(--text-hi)' }}>{t.bonusVintage}</Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <CheckCircleRoundedIcon fontSize="small" sx={{ color: 'var(--success, #4ade80)' }} />
                <Typography variant="body2" sx={{ color: 'var(--text-hi)' }}>{t.bonusGtaPlus}</Typography>
              </Stack>
            </Stack>
          </Box>
        </Box>
      </Reveal>

      {/* Platforms + preload */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={{ xs: 1, sm: 3 }}
        justifyContent="center"
        alignItems="center"
        sx={{ mt: 3, color: 'var(--text-mid)' }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <SportsEsportsRoundedIcon fontSize="small" sx={{ color: 'var(--c-pink)' }} />
          <Typography variant="caption">
            {t.platformsLabel}: PS5 · Xbox Series X|S — {t.pcLater}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center">
          <DownloadRoundedIcon fontSize="small" sx={{ color: 'var(--c-pink)' }} />
          <Typography variant="caption">{t.preloadNote}</Typography>
        </Stack>
      </Stack>
    </Box>
  );
}
