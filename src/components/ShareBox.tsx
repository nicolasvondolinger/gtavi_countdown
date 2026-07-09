'use client';

import { Box, Button, Typography } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import RedditIcon from '@mui/icons-material/Reddit';
import XIcon from '@mui/icons-material/X';
import { useLanguage } from '@/hooks/useLanguage';
import { SITE_URL } from '@/lib/site';
import Reveal from '@/components/ui/Reveal';

export default function ShareBox() {
  const { translations } = useLanguage();
  const shareText = encodeURIComponent(translations.shareText);
  const shareUrl = encodeURIComponent(SITE_URL);

  const buttons = [
    { icon: <XIcon />, label: translations.shareOnX, href: `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}` },
    { icon: <FacebookIcon />, label: translations.shareOnFacebook, href: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}` },
    { icon: <RedditIcon />, label: translations.shareOnReddit, href: `https://www.reddit.com/submit?url=${shareUrl}&title=${shareText}` },
  ];

  return (
    <Box component="section" sx={{ px: { xs: 2, md: 4 }, py: { xs: 5, md: 8 }, maxWidth: 780, mx: 'auto' }}>
      <Reveal
        sx={{
          position: 'relative',
          textAlign: 'center',
          px: { xs: 3, md: 5 },
          py: { xs: 4, md: 5 },
          borderRadius: 'var(--r-lg)',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, rgba(157,78,221,0.18), rgba(255,30,122,0.16))',
          border: '1px solid var(--hairline)',
          boxShadow: '0 16px 50px rgba(255,30,122,0.18)',
        }}
      >
        <Typography
          className="gta-display"
          sx={{ fontSize: { xs: '1.8rem', md: '2.4rem' }, color: '#fff', mb: 3, textShadow: '0 0 24px rgba(255,30,122,0.5)' }}
        >
          {translations.shareTitle}
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 1.5 }}>
          {buttons.map((b) => (
            <Button
              key={b.label}
              href={b.href}
              target="_blank"
              rel="noopener noreferrer"
              variant="outlined"
              startIcon={b.icon}
              sx={{ px: 2.5, py: 1.1, borderRadius: 'var(--r-pill)' }}
            >
              {b.label}
            </Button>
          ))}
        </Box>
      </Reveal>
    </Box>
  );
}
