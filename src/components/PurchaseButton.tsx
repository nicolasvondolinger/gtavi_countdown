'use client';

import { Button } from '@mui/material';
import Link from 'next/link';
import { useLanguage } from '@/hooks/useLanguage';
import { PRE_ORDER_URL } from '@/lib/site';

export default function PurchaseButton() {
  const { translations } = useLanguage();

  return (
    <Button
      component={Link}
      href={PRE_ORDER_URL}
      target="_blank"
      rel="noopener noreferrer"
      variant="contained"
      sx={{
        mt: 4,
        mb: 4,
        py: 2,
        px: 4,
        fontSize: '1.1rem',
        fontWeight: 'bold',
        background: 'linear-gradient(to bottom, #335FCF, #A941C1, #FF5E94, #FF9547)', // Gradiente igual ao do calendário
        color: 'white',
        '&:hover': {
          opacity: 0.9,
          background: 'linear-gradient(to bottom, #335FCF, #A941C1, #FF5E94, #FF9547)',
          transform: 'scale(1.02)',
        },
        '&:active': {
          transform: 'scale(0.98)',
        },
        transition: 'all 0.2s ease-in-out',
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
        borderRadius: '12px', // Bordas arredondadas
        textTransform: 'none', // Texto sem transformação para maiúsculas
      }}
    >
      {translations.purchase || "BUY NOW"}
    </Button>
  );
}