// styles/theme.ts
import { createTheme } from '@mui/material/styles';

// Design tokens — kept in sync with CSS custom properties in globals.css.
export const tokens = {
  blue: '#335FCF',
  purple: '#A941C1',
  pink: '#FF5E94',
  orange: '#FF9547',
  magenta: '#FF1E7A',
  violet: '#9D4EDD',
  teal: '#2DE2E6',
  bg0: '#07060D',
  bg1: '#0B0A14',
  surface: '#12101C',
  textHi: '#F4F1FB',
  textMid: 'rgba(244,241,251,0.72)',
  textLo: 'rgba(244,241,251,0.5)',
  gradBrand:
    'linear-gradient(120deg, #335FCF, #A941C1 38%, #FF5E94 68%, #FF9547)',
  gradHot: 'linear-gradient(135deg, #9D4EDD, #FF1E7A)',
} as const;

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: tokens.magenta, light: '#ff5ea0', dark: '#c8005f', contrastText: '#fff' },
    secondary: { main: tokens.violet, light: '#c08bf0', dark: '#6d2fae', contrastText: '#fff' },
    info: { main: tokens.teal },
    warning: { main: tokens.orange },
    success: { main: '#4ade80' },
    error: { main: '#ff5470' },
    background: { default: tokens.bg0, paper: tokens.surface },
    text: { primary: tokens.textHi, secondary: tokens.textMid },
    divider: 'rgba(255,255,255,0.1)',
  },
  shape: { borderRadius: 14 },
  typography: {
    fontFamily: 'var(--font-outfit), "Inter", "Roboto", system-ui, sans-serif',
    h1: {
      fontFamily: 'var(--font-pricedown), sans-serif',
      fontWeight: 400,
      letterSpacing: '0.02em',
      lineHeight: 0.92,
      textTransform: 'uppercase',
    },
    h2: {
      fontFamily: 'var(--font-pricedown), sans-serif',
      fontWeight: 400,
      letterSpacing: '0.02em',
      lineHeight: 0.95,
      textTransform: 'uppercase',
    },
    h3: {
      fontFamily: 'var(--font-outfit), sans-serif',
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
    h4: { fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 700 },
    h5: { fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 600 },
    h6: { fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 600 },
    subtitle1: { fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 500 },
    subtitle2: { fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 500 },
    body1: { fontFamily: 'var(--font-outfit), sans-serif', lineHeight: 1.65 },
    body2: { fontFamily: 'var(--font-outfit), sans-serif', lineHeight: 1.65 },
    button: { fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 700, letterSpacing: '0.02em' },
    caption: { fontFamily: 'var(--font-outfit), sans-serif' },
    overline: {
      fontFamily: 'var(--font-bebas-neue), sans-serif',
      letterSpacing: '0.28em',
      fontSize: '0.85rem',
    },
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 12,
          fontWeight: 700,
          transition: 'transform 0.2s var(--ease-out, ease), box-shadow 0.2s ease, background 0.2s ease',
          '&:active': { transform: 'scale(0.97)' },
        },
        containedPrimary: {
          background: tokens.gradHot,
          color: '#fff',
          boxShadow: '0 8px 24px rgba(255, 30, 122, 0.35)',
          '&:hover': {
            background: tokens.gradHot,
            boxShadow: '0 10px 30px rgba(255, 30, 122, 0.55)',
            transform: 'translateY(-2px)',
          },
        },
        outlined: {
          borderColor: 'rgba(255,255,255,0.28)',
          color: tokens.textHi,
          backdropFilter: 'blur(6px)',
          '&:hover': {
            borderColor: tokens.teal,
            background: 'rgba(45,226,230,0.08)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none', borderRadius: 16 },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          background: 'rgba(12,10,20,0.95)',
          border: '1px solid rgba(255,255,255,0.14)',
          fontSize: '0.78rem',
        },
      },
    },
    MuiCssBaseline: {
      // Fonts are loaded via next/font (see lib/font.ts). Global textures and
      // tokens live in app/globals.css; this only wires legacy helper classes.
      styleOverrides: `
        .gta-title {
          font-family: var(--font-pricedown), sans-serif;
          text-transform: uppercase;
          letter-spacing: 0.02em;
        }
      `,
    },
  },
});

export default theme;
