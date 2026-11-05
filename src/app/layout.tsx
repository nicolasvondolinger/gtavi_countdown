import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Archivo, Barlow, Barlow_Condensed, JetBrains_Mono } from 'next/font/google';
import { MobileAccount } from '@/components/layout/AccountArea';
import { BottomNav } from '@/components/layout/BottomNav';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { MobileBar } from '@/components/layout/MobileBar';
import { TopAd } from '@/components/layout/TopAd';
import { ViewerProvider } from '@/components/layout/useViewer';
import { SITE_NAME, SITE_URL } from '@/lib/site';
import './globals.css';

const barlowCondensed = Barlow_Condensed({ subsets: ['latin'], weight: ['600', '700'], variable: '--font-barlow-condensed' });
const barlow = Barlow({ subsets: ['latin'], weight: ['400', '600'], variable: '--font-barlow' });
const archivo = Archivo({ subsets: ['latin'], variable: '--font-archivo' });
const jetbrains = JetBrains_Mono({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-jetbrains' });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_NAME, template: `%s | ${SITE_NAME}` },
  openGraph: { siteName: SITE_NAME, type: 'website', images: ['/media/bg/hero.webp'] },
  twitter: { card: 'summary_large_image' },
  description: 'The community-verified encyclopedia of the Grand Theft Auto series.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${barlowCondensed.variable} ${barlow.variable} ${archivo.variable} ${jetbrains.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-bg focus:p-3">Skip to content</a>
        <ViewerProvider>
        <TopAd />
        <Header />
        <MobileBar account={<MobileAccount />} />
        <main id="main" className="flex-1">{children}</main>
        <Footer />
        <BottomNav />
        </ViewerProvider>
      </body>
    </html>
  );
}
