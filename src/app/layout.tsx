import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Archivo, Barlow, Barlow_Condensed, JetBrains_Mono } from 'next/font/google';
import { BottomNav } from '@/components/layout/BottomNav';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { MobileBar } from '@/components/layout/MobileBar';
import { TopAd } from '@/components/layout/TopAd';
import './globals.css';

const barlowCondensed = Barlow_Condensed({ subsets: ['latin'], weight: ['600', '700'], variable: '--font-barlow-condensed' });
const barlow = Barlow({ subsets: ['latin'], weight: ['400', '600'], variable: '--font-barlow' });
const archivo = Archivo({ subsets: ['latin'], variable: '--font-archivo' });
const jetbrains = JetBrains_Mono({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-jetbrains' });

export const metadata: Metadata = {
  title: { default: 'GTA Wiki', template: '%s | GTA Wiki' },
  description: 'The community-verified encyclopedia of the Grand Theft Auto series.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${barlowCondensed.variable} ${barlow.variable} ${archivo.variable} ${jetbrains.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <TopAd />
        <Header />
        <MobileBar account={null} />
        <main className="flex-1">{children}</main>
        <Footer />
        <BottomNav />
      </body>
    </html>
  );
}
