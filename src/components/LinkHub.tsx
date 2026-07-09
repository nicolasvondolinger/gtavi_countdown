'use client';

import { Box, Typography } from '@mui/material';
import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded';
import StorefrontRoundedIcon from '@mui/icons-material/StorefrontRounded';
import NewspaperRoundedIcon from '@mui/icons-material/NewspaperRounded';
import YouTubeIcon from '@mui/icons-material/YouTube';
import InstagramIcon from '@mui/icons-material/Instagram';
import XIcon from '@mui/icons-material/X';
import ArrowOutwardRoundedIcon from '@mui/icons-material/ArrowOutwardRounded';
import type { SvgIconComponent } from '@mui/icons-material';
import { useLanguage } from '@/hooks/useLanguage';
import { SITE_LINKS, type SiteLink, type LinkKind } from '@/lib/site';
import SectionHeader from '@/components/ui/SectionHeader';
import Reveal from '@/components/ui/Reveal';

const ICONS: Record<SiteLink['icon'], SvgIconComponent> = {
  cart: ShoppingCartRoundedIcon,
  store: StorefrontRoundedIcon,
  news: NewspaperRoundedIcon,
  x: XIcon,
  youtube: YouTubeIcon,
  instagram: InstagramIcon,
  discord: ShoppingCartRoundedIcon,
};

const ACCENT: Record<LinkKind, string> = {
  affiliate: 'var(--c-magenta)',
  official: 'var(--c-violet)',
  community: 'var(--c-teal)',
};

function LinkCard({ link, copy, delay }: { link: SiteLink; copy: { title: string; desc: string }; delay: number }) {
  const Icon = ICONS[link.icon];
  const accent = ACCENT[link.kind];
  const featured = link.kind === 'affiliate';

  return (
    <Reveal delay={delay} sx={{ display: 'flex' }}>
      <Box
        component="a"
        href={link.href}
        target="_blank"
        rel="noopener noreferrer sponsored"
        sx={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          width: '100%',
          p: { xs: 2.25, md: 2.5 },
          borderRadius: 'var(--r-md)',
          textDecoration: 'none',
          overflow: 'hidden',
          border: '1px solid',
          borderColor: featured ? 'transparent' : 'var(--hairline)',
          background: featured
            ? 'linear-gradient(135deg, rgba(157,78,221,0.25), rgba(255,30,122,0.22))'
            : 'var(--surface)',
          backdropFilter: 'blur(10px)',
          boxShadow: featured ? '0 14px 40px rgba(255,30,122,0.28)' : '0 8px 24px rgba(0,0,0,0.3)',
          transition: 'transform 0.25s var(--ease-out), box-shadow 0.25s ease, border-color 0.25s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            borderColor: accent,
            boxShadow: `0 18px 44px rgba(0,0,0,0.4), 0 0 22px ${accent}55`,
          },
          '&:hover .lh-arrow': { transform: 'translate(3px,-3px)', opacity: 1 },
          '&::before': {
            content: '""',
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: 4,
            background: accent,
            boxShadow: `0 0 16px ${accent}`,
          },
        }}
      >
        <Box
          sx={{
            flexShrink: 0,
            width: 48,
            height: 48,
            borderRadius: 'var(--r-sm)',
            display: 'grid',
            placeItems: 'center',
            color: '#fff',
            background: `linear-gradient(145deg, ${accent}33, ${accent}18)`,
            border: `1px solid ${accent}66`,
          }}
        >
          <Icon fontSize="small" />
        </Box>
        <Box sx={{ minWidth: 0, flexGrow: 1 }}>
          <Typography sx={{ fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>
            {copy.title}
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: 'var(--text-mid)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
          >
            {copy.desc}
          </Typography>
        </Box>
        <ArrowOutwardRoundedIcon
          className="lh-arrow"
          sx={{ color: accent, opacity: 0.6, transition: 'all 0.25s var(--ease-out)', flexShrink: 0 }}
        />
      </Box>
    </Reveal>
  );
}

export default function LinkHub() {
  const { translations: t } = useLanguage();
  const linkCopy = t.links as Record<string, { title: string; desc: string }>;

  const featured = SITE_LINKS.filter((l) => l.kind === 'affiliate');
  const rest = SITE_LINKS.filter((l) => l.kind !== 'affiliate');

  return (
    <Box
      component="section"
      id="links"
      sx={{ px: { xs: 2, md: 4 }, py: { xs: 7, md: 11 }, maxWidth: 1180, mx: 'auto' }}
    >
      <SectionHeader kicker="Play Now" title={t.linksTitle} subtitle={t.linksSubtitle} />

      <Box
        sx={{
          display: 'grid',
          gap: { xs: 1.75, md: 2.25 },
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
        }}
      >
        {featured.map((link, i) => (
          <Box key={link.id} sx={{ gridColumn: { sm: '1 / -1', lg: 'span 3' } }}>
            <LinkCard link={link} copy={linkCopy[link.labelKey]} delay={i * 60} />
          </Box>
        ))}
        {rest.map((link, i) => (
          <LinkCard key={link.id} link={link} copy={linkCopy[link.labelKey]} delay={i * 60} />
        ))}
      </Box>
    </Box>
  );
}
