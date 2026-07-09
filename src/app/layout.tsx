// app/layout.tsx
import type { Metadata, Viewport } from 'next';
import './globals.css';
import { bebasNeue, outfit, pricedown, jetbrainsMono } from '@/lib/font';
import ThemeRegistry from '@/components/ThemeRegistry';
import { SITE_URL, SITE_NAME } from '@/lib/site';

const description =
  'Countdown to the worldwide release of Grand Theft Auto VI on November 19, 2026. Pre-orders are open — see editions and pricing, watch the official trailers, meet the characters, and see the release time in your timezone.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: `${SITE_NAME} · GTA 6 Release Countdown`,
  description,
  keywords: ['GTA VI', 'GTA 6', 'countdown', 'release date', 'Rockstar Games', 'Vice City'],
  applicationName: SITE_NAME,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: SITE_URL,
    title: `${SITE_NAME} · GTA 6 Release Countdown`,
    description,
    siteName: SITE_NAME,
    images: [{ url: `${SITE_URL}/assets/gta6.png`, width: 1200, height: 630, alt: 'GTA VI' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} · GTA 6 Release Countdown`,
    description,
    images: [`${SITE_URL}/assets/gta6.png`],
  },
};

export const viewport: Viewport = {
  themeColor: '#07060d',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${pricedown.variable} ${bebasNeue.variable} ${outfit.variable} ${jetbrainsMono.variable}`}>
        <ThemeRegistry>
          {children}
        </ThemeRegistry>
      </body>
    </html>
  );
}
