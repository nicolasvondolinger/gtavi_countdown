'use client';

import { Box, Tooltip } from '@mui/material';
import { useLanguage } from '@/hooks/useLanguage';
import { asset } from '@/lib/asset';
import type { SupportedLanguages } from '@/i18n/translations';

const LANGUAGES: { code: SupportedLanguages; flag: string; label: string }[] = [
  { code: 'en', flag: 'assets/usa.png', label: 'English' },
  { code: 'pt', flag: 'assets/brazil.png', label: 'Português' },
  { code: 'es', flag: 'assets/spain.png', label: 'Español' },
];

export default function LanguageSwitcher() {
  const { currentLanguage, setCurrentLanguage } = useLanguage();

  return (
    <Box
      sx={{
        position: 'fixed',
        top: { xs: 12, sm: 20 },
        right: { xs: 12, sm: 20 },
        zIndex: 1200,
        display: 'flex',
        gap: 1,
        p: 1,
        borderRadius: '999px',
        backgroundColor: 'rgba(0, 0, 0, 0.55)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        boxShadow: '0 4px 16px rgba(255, 0, 102, 0.25)',
      }}
    >
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
                outline: active ? '2px solid #FF0066' : '2px solid transparent',
                outlineOffset: '2px',
                opacity: active ? 1 : 0.55,
                transition: 'all 0.2s ease',
                boxShadow: active ? '0 0 12px rgba(255, 0, 102, 0.8)' : 'none',
                '&:hover': { opacity: 1, transform: 'scale(1.12)' },
              }}
            >
              <Box
                component="img"
                src={asset(flag)}
                alt={label}
                sx={{
                  width: { xs: 28, sm: 32 },
                  height: { xs: 28, sm: 32 },
                  borderRadius: '50%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
            </Box>
          </Tooltip>
        );
      })}
    </Box>
  );
}
