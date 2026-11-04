import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Archivo, Barlow, Barlow_Condensed, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const barlowCondensed = Barlow_Condensed({ subsets: ['latin'], weight: ['600', '700'], variable: '--font-barlow-condensed' });
const barlow = Barlow({ subsets: ['latin'], weight: ['400', '600'], variable: '--font-barlow' });
const archivo = Archivo({ subsets: ['latin'], variable: '--font-archivo' });
const jetbrains = JetBrains_Mono({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-jetbrains' });

export const metadata: Metadata = {
  title: 'GTA Wiki',
  description: 'The community-verified encyclopedia of the Grand Theft Auto series.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${barlowCondensed.variable} ${barlow.variable} ${archivo.variable} ${jetbrains.variable}`}>
      <body>{children}</body>
    </html>
  );
}
