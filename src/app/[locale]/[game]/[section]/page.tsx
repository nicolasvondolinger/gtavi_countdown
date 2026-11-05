import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Container } from '@/components/ui/Container';
import { Link } from '@/i18n/navigation';
import { pageLocale } from '@/i18n/page';
import { getT } from '@/i18n/server';
import { translate } from '@/i18n/translate';
import { SECTION_LABEL, SECTION_TITLE, isSection } from '@/lib/sections';
import { getGame, getGamePages } from '@/server/wiki/queries';

export const revalidate = 300;
export function generateStaticParams() {
  return [];
}

type Props = { params: Promise<{ locale: string; game: string; section: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, game: slug, section } = await params;
  const game = await getGame(slug, locale);
  return game && isSection(section) ? { title: translate(locale, SECTION_TITLE[section], { game: game.shortName }) } : {};
}

export default async function SectionPage({ params }: Props) {
  const locale = await pageLocale(params);
  const t = await getT();
  const { game: slug, section } = await params;
  const game = await getGame(slug, locale);
  if (!game || !isSection(section)) notFound();
  const pages = await getGamePages(game.id, locale, section);
  return (
    <Container className="mt-6 mb-16 flex flex-col gap-4 lg:mt-8">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Games', href: '/games' }, { label: game.shortName, href: `/${game.slug}` }, { label: SECTION_LABEL[section] }]} />
      <h1 className="text-[41px] lg:text-[56px]">{t(SECTION_TITLE[section], { game: game.shortName })}</h1>
      {pages.length === 0 && <p className="font-read text-[15px] text-muted">{t('No pages here yet.')}</p>}
      <ul>
        {pages.map(p => (
          <li key={p.slug} className="border-t border-line">
            <Link href={`/${game.slug}/${section}/${p.slug}`} className="group flex items-center gap-4 py-3">
              {p.image && (
                <span className="relative size-14 shrink-0 overflow-hidden rounded-image">
                  <Image src={`/media/${p.image}`} alt="" fill sizes="56px" className="object-cover" />
                </span>
              )}
              <span className="flex min-w-0 flex-col gap-0.5">
                <span className="text-[17px] font-semibold group-hover:text-accent">{p.title}</span>
                <span className="line-clamp-2 font-read text-sm text-muted">{p.summary}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </Container>
  );
}
