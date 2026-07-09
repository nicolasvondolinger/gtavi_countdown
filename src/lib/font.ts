// lib/font.ts
import { Bebas_Neue, Outfit, JetBrains_Mono } from 'next/font/google';
import localFont from 'next/font/local';

// Pricedown — the iconic GTA display face. Used for the logo-style headlines.
export const pricedown = localFont({
  src: '../../public/fonts/Pricedown Bl.otf',
  display: 'swap',
  variable: '--font-pricedown',
});

// Bebas Neue — tall condensed grotesque for section eyebrows / kickers.
export const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-bebas-neue',
});

// Outfit — clean, geometric body/UI typeface.
export const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit',
});

// JetBrains Mono — tactical/HUD numerals and technical labels (tabular figures).
export const jetbrainsMono = JetBrains_Mono({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
});
