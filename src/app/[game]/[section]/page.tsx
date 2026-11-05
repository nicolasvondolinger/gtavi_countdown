import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Container } from '@/components/ui/Container';
import { SECTION_LABEL, isSection } from '@/lib/sections';
import { getGame, getGamePages } from '@/server/wiki/queries';

export const revalidate = 300;
export function generateStaticParams() {
  return [];
}

type Props = { params: Promise<{ game: string; section: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { game: slug, section } = await params;
  const game = await getGame(slug);
  return game && isSection(section) ? { title: `${game.shortName} ${SECTION_LABEL[section].toLowerCase()}` } : {};
}

export default async function SectionPage({ params }: Props) {
  const { game: slug, section } = await params;
  const game = await getGame(slug);
  if (!game || !isSection(section)) notFound();
  const pages = await getGamePages(game.id, section);
  const label = SECTION_LABEL[section];
  return (
    <Container className="mt-6 mb-16 flex flex-col gap-4 lg:mt-8">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Games', href: '/games' }, { label: game.shortName, href: `/${game.slug}` }, { label }]} />
      <h1 className="text-[41px] lg:text-[56px]">{game.shortName} {label.toLowerCase()}</h1>
      {pages.length === 0 && <p className="font-read text-[15px] text-muted">No pages here yet.</p>}
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
