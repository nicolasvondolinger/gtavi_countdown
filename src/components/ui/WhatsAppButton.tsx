'use client';

import { Button, IconButton, Tooltip } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { useLanguage } from '@/hooks/useLanguage';
import { WHATSAPP_GROUP_URL } from '@/lib/site';

const greenSx: SxProps<Theme> = {
  background: 'linear-gradient(135deg, #25D366, #12B24A)',
  color: '#05231a',
  fontWeight: 700,
  borderRadius: 'var(--r-pill)',
  boxShadow: '0 8px 24px rgba(37,211,102,0.35)',
  '&:hover': {
    background: 'linear-gradient(135deg, #2BE070, #12B24A)',
    boxShadow: '0 10px 30px rgba(37,211,102,0.55)',
    transform: 'translateY(-2px)',
  },
};

interface Props {
  iconOnly?: boolean;
  fullWidth?: boolean;
  onClick?: () => void;
  sx?: SxProps<Theme>;
}

const toArray = (sx?: SxProps<Theme>) => (Array.isArray(sx) ? sx : sx ? [sx] : []);

export default function WhatsAppButton({ iconOnly = false, fullWidth, onClick, sx }: Props) {
  const { translations: t } = useLanguage();
  const label = t.joinWhatsapp;

  if (iconOnly) {
    return (
      <Tooltip title={label} arrow>
        <IconButton
          href={WHATSAPP_GROUP_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          onClick={onClick}
          sx={[
            { color: '#25D366', border: '1px solid rgba(37,211,102,0.5)', borderRadius: 'var(--r-pill)' },
            ...toArray(sx),
          ]}
        >
          <WhatsAppIcon />
        </IconButton>
      </Tooltip>
    );
  }

  return (
    <Button
      href={WHATSAPP_GROUP_URL}
      target="_blank"
      rel="noopener noreferrer"
      variant="contained"
      fullWidth={fullWidth}
      onClick={onClick}
      startIcon={<WhatsAppIcon />}
      sx={[...toArray(greenSx), ...toArray(sx)]}
    >
      {label}
    </Button>
  );
}
