'use client';

import { Box, Typography } from '@mui/material';
import { useLanguage } from '@/hooks/useLanguage';

export default function Footer() {
  const { translations } = useLanguage();

  return (
    <Box
      component="footer"
      sx={{
        mt: 'auto',
        pt: { xs: 4, md: 5 },
        pb: 4,
        px: 2,
        textAlign: 'center',
        borderTop: '1px solid var(--hairline)',
        background: 'linear-gradient(180deg, transparent, rgba(11,10,20,0.7))',
      }}
    >
      <Typography
        variant="caption"
        sx={{ color: 'var(--text-lo)', display: 'block', maxWidth: 640, mx: 'auto', lineHeight: 1.7 }}
      >
        © {new Date().getFullYear()} GTA VI Countdown. {translations.allRightsReserved}{' '}
        <Box
          component="a"
          href="https://www.rockstargames.com/VI"
          target="_blank"
          rel="noopener noreferrer"
          className="gradient-text"
          sx={{ textDecoration: 'none', fontWeight: 600, '&:hover': { textDecoration: 'underline' } }}
        >
          Rockstar Games
        </Box>
        . {translations.notAffiliated}
      </Typography>
    </Box>
  );
}
