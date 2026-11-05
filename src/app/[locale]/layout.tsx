import type { Metadata } from 'next';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { Archivo, Barlow, Barlow_Condensed, JetBrains_Mono } from 'next/font/google';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import { MobileAccount } from '@/components/layout/AccountArea';
import { BottomNav } from '@/components/layout/BottomNav';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { MobileBar } from '@/components/layout/MobileBar';
import { THEME_SCRIPT } from '@/components/layout/theme';
import { TopAd } from '@/components/layout/TopAd';
import { ViewerProvider } from '@/components/layout/useViewer';
import { routing } from '@/i18n/routing';
import { translate } from '@/i18n/translate';
import { SITE_NAME, SITE_URL } from '@/lib/site';
import '../globals.css';

const barlowCondensed = Barlow_Condensed({ subsets: ['latin'], weight: ['600', '700'], variable: '--font-barlow-condensed' });
const barlow = Barlow({ subsets: ['latin'], weight: ['400', '600'], variable: '--font-barlow' });
const archivo = Archivo({ subsets: ['latin'], variable: '--font-archivo' });
const jetbrains = JetBrains_Mono({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-jetbrains' });

type Props = { children: ReactNode; params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }));
}

export async function generateMetadata({ params }: Omit<Props, 'children'>): Promise<Metadata> {
  const { locale } = await params;
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: SITE_NAME, template: `%s | ${SITE_NAME}` },
    openGraph: { siteName: SITE_NAME, type: 'website', images: ['/media/art/key-01.webp'], locale: locale === 'pt' ? 'pt_BR' : 'en_US' },
    twitter: { card: 'summary_large_image' },
    description: translate(locale, 'The community-verified encyclopedia of the Grand Theft Auto series.'),
  };
}

export default async function RootLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  return (
    <html lang={locale === 'pt' ? 'pt-BR' : 'en'} suppressHydrationWarning className={`${barlowCondensed.variable} ${barlow.variable} ${archivo.variable} ${jetbrains.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="flex min-h-dvh flex-col">
        <NextIntlClientProvider locale={locale} messages={{}}>
          <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-bg focus:p-3">{translate(locale, 'Skip to content')}</a>
          <ViewerProvider>
            <TopAd />
            <Header />
            <MobileBar account={<MobileAccount />} />
            <main id="main" className="flex-1">{children}</main>
            <Footer />
            <BottomNav />
          </ViewerProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
