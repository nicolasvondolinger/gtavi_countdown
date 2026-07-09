'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Drawer,
  IconButton,
  Stack,
  Tooltip,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { useLanguage } from '@/hooks/useLanguage';
import { asset } from '@/lib/asset';
import { PRE_ORDER_URL } from '@/lib/site';
import WhatsAppButton from '@/components/ui/WhatsAppButton';
import type { SupportedLanguages } from '@/i18n/translations';

const LANGUAGES: { code: SupportedLanguages; flag: string; label: string }[] = [
  { code: 'en', flag: 'assets/usa.png', label: 'English' },
  { code: 'pt', flag: 'assets/brazil.png', label: 'Português' },
  { code: 'es', flag: 'assets/spain.png', label: 'Español' },
];

function LangSwitch() {
  const { currentLanguage, setCurrentLanguage } = useLanguage();
  return (
    <Stack direction="row" spacing={0.75} alignItems="center">
      {LANGUAGES.map(({ code, flag, label }) => {
        const active = currentLanguage === code;
        return (
          <Tooltip key={code} title={label} arrow>
            <Box
              component="button"
              onClick={() => setCurrentLanguage(code)}
              aria-label={label}
              aria-pressed={active}
              sx={{
                p: 0,
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                lineHeight: 0,
                borderRadius: '50%',
                outline: active ? '2px solid var(--c-magenta)' : '2px solid transparent',
                outlineOffset: '2px',
                opacity: active ? 1 : 0.5,
                transition: 'all 0.2s ease',
                boxShadow: active ? '0 0 12px rgba(255,30,122,0.8)' : 'none',
                '&:hover': { opacity: 1, transform: 'scale(1.12)' },
              }}
            >
              <Box
                component="img"
                src={asset(flag)}
                alt={label}
                sx={{ width: 26, height: 26, borderRadius: '50%', objectFit: 'cover', display: 'block' }}
              />
            </Box>
          </Tooltip>
        );
      })}
    </Stack>
  );
}

export default function NavBar() {
  const { translations: t } = useLanguage();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const NAV = [
    { id: 'countdown', label: t.nav.countdown },
    { id: 'links', label: t.nav.preorder },
    { id: 'editions', label: t.nav.editions },
    { id: 'world', label: t.nav.world },
    { id: 'characters', label: t.nav.characters },
    { id: 'trailers', label: t.nav.trailers },
  ];

  const linkSx = {
    color: 'var(--text-mid)',
    fontWeight: 600,
    fontSize: '0.95rem',
    textDecoration: 'none',
    position: 'relative' as const,
    py: 0.5,
    transition: 'color 0.2s ease',
    '&:hover': { color: '#fff' },
    '&::after': {
      content: '""',
      position: 'absolute',
      left: 0,
      bottom: -2,
      width: '0%',
      height: 2,
      background: 'var(--grad-hot)',
      transition: 'width 0.25s var(--ease-out)',
    },
    '&:hover::after': { width: '100%' },
  };

  const Brand = (
    <Box
      component="a"
      href="#top"
      aria-label="GTA VI Countdown"
      sx={{ display: 'flex', alignItems: 'center', gap: 1.25, textDecoration: 'none' }}
    >
      <Box
        component="img"
        src={asset('assets/gta-logo.png')}
        alt="GTA VI"
        sx={{ height: 30, filter: 'drop-shadow(0 0 8px rgba(255,30,122,0.5))' }}
      />
      <Box
        component="span"
        className="font-kicker"
        sx={{ color: 'var(--text-lo)', fontSize: '0.7rem', display: { xs: 'none', sm: 'block' } }}
      >
        Countdown
      </Box>
    </Box>
  );

  const PreOrderBtn = (
    <Button
      href={PRE_ORDER_URL}
      target="_blank"
      rel="noopener noreferrer"
      variant="contained"
      color="primary"
      sx={{ px: 2.5, py: 1, borderRadius: 'var(--r-pill)' }}
    >
      {t.nav.preorder}
    </Button>
  );

  return (
    <Box
      component="nav"
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1200,
        height: 'var(--nav-h)',
        display: 'flex',
        alignItems: 'center',
        px: { xs: 2, md: 4 },
        transition: 'background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
        borderBottom: '1px solid',
        borderColor: scrolled ? 'var(--hairline)' : 'transparent',
        background: scrolled ? 'rgba(9,8,16,0.82)' : 'transparent',
        backdropFilter: scrolled ? 'blur(14px)' : 'none',
        boxShadow: scrolled ? '0 8px 30px rgba(0,0,0,0.35)' : 'none',
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 1280,
          mx: 'auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        {Brand}

        {isDesktop ? (
          <>
            <Stack direction="row" spacing={3} alignItems="center">
              {NAV.map((item) => (
                <Box key={item.id} component="a" href={`#${item.id}`} sx={linkSx}>
                  {item.label}
                </Box>
              ))}
            </Stack>
            <Stack direction="row" spacing={1.75} alignItems="center">
              <LangSwitch />
              <WhatsAppButton sx={{ px: 2, py: 0.9 }} />
              {PreOrderBtn}
            </Stack>
          </>
        ) : (
          <Stack direction="row" spacing={1} alignItems="center">
            <WhatsAppButton iconOnly />
            {PreOrderBtn}
            <IconButton onClick={() => setOpen(true)} sx={{ color: '#fff' }} aria-label="Menu">
              <MenuIcon />
            </IconButton>
          </Stack>
        )}
      </Box>

      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            width: 280,
            background: 'rgba(11,10,20,0.96)',
            backdropFilter: 'blur(16px)',
            borderLeft: '1px solid var(--hairline)',
            p: 3,
          },
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <LangSwitch />
          <IconButton onClick={() => setOpen(false)} sx={{ color: '#fff' }} aria-label="Close">
            <CloseIcon />
          </IconButton>
        </Stack>
        <Stack spacing={1}>
          {NAV.map((item) => (
            <Box
              key={item.id}
              component="a"
              href={`#${item.id}`}
              onClick={() => setOpen(false)}
              sx={{
                color: 'var(--text-hi)',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '1.1rem',
                py: 1.25,
                borderBottom: '1px solid var(--hairline)',
                '&:hover': { color: 'var(--c-pink)' },
              }}
            >
              {item.label}
            </Box>
          ))}
        </Stack>
        <WhatsAppButton fullWidth onClick={() => setOpen(false)} sx={{ mt: 3, py: 1.25 }} />
        <Button
          href={PRE_ORDER_URL}
          target="_blank"
          rel="noopener noreferrer"
          variant="contained"
          color="primary"
          fullWidth
          onClick={() => setOpen(false)}
          sx={{ mt: 1.5, py: 1.25, borderRadius: 'var(--r-pill)' }}
        >
          {t.nav.preorder}
        </Button>
      </Drawer>
    </Box>
  );
}
