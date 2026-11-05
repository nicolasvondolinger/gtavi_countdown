import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AdSlot } from '@/components/ui/AdSlot';
import { ArtSlot } from '@/components/ui/ArtSlot';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { LinkButton, TextLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { SECTIONS, SECTION_LABEL } from '@/lib/sections';
import { getThreadsAbout } from '@/server/forum/queries';
import { getGame, getGamePages } from '@/server/wiki/queries';

export const revalidate = 300;
export function generateStaticParams() {
  return [];
}

type Props = { params: Promise<{ game: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const game = await getGame((await params).game);
  return game ? { title: game.name, description: game.summary ?? `${game.name} characters, vehicles, missions, maps and guides.` } : {};
}

export default async function GameHub({ params }: Props) {
  const game = await getGame((await params).game);
  if (!game) notFound();
  const [pages, threads] = await Promise.all([getGamePages(game.id), getThreadsAbout([game.shortName, game.name])]);
  const topics = SECTIONS.map(section => ({ section, items: pages.filter(p => p.section === section).slice(0, 4) })).filter(t => t.items.length > 0);

  return (
    <>
      <Container className="mt-5 grid gap-6 lg:mt-7 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:gap-8">
        <div className="flex flex-col gap-3.5">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Games', href: '/games' }, { label: game.shortName }]} />
          {game.image ? (
            <div className="relative aspect-video overflow-hidden rounded-image">
              <Image src={`/media/${game.image}`} alt={`${game.name} key art`} fill priority sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover" />
            </div>
          ) : (
            <ArtSlot label={`official ${game.shortName} key art`} className="aspect-[2/1]" />
          )}
        </div>
        <div className="flex flex-col gap-3.5 lg:pt-7">
          <h1 className="text-[41px] lg:text-[56px]">{game.name}</h1>
          {game.summary && <p className="font-read text-base/[1.6] text-body lg:text-[17px]">{game.summary}</p>}
          <dl>
            {(game.facts.length ? game.facts : [{ label: 'Year', value: String(game.year) }, { label: 'Setting', value: game.setting }, { label: 'Leads', value: game.leads }]).map(f => (
              <div key={f.label} className="flex gap-3 border-t border-line py-2">
                <dt className="w-[100px] shrink-0 text-sm text-muted">{f.label}</dt>
                <dd className="text-sm font-semibold">{f.value}</dd>
              </div>
            ))}
          </dl>
          <LinkButton href={`/${game.slug}/map`} className="py-3">Open the {game.setting.split(',')[0]} map</LinkButton>
        </div>
      </Container>
      <Container className="mt-10 mb-16 grid gap-10 lg:mt-14 lg:mb-20 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:gap-8">
        <section aria-label={`Browse ${game.shortName}`}>
          <h2 className="mb-5 text-[26px] lg:text-[33px]">Browse {game.shortName}</h2>
          {topics.length === 0 ? (
            <p className="font-read text-[15px] text-muted">No pages yet. This game is waiting for its first editor.</p>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {topics.map(({ section, items }) => (
                <div key={section}>
                  <div className="flex items-center justify-between pb-2">
                    <h3 className="font-ui text-[17px] font-semibold">{SECTION_LABEL[section]}</h3>
                    <TextLink href={`/${game.slug}/${section}`} className="text-sm" aria-label={`All ${SECTION_LABEL[section]}`}>All</TextLink>
                  </div>
                  <ul>
                    {items.map(p => (
                      <li key={p.slug} className="border-t border-line py-2">
                        <Link href={`/${game.slug}/${section}/${p.slug}`} className="text-[15px] text-body hover:text-accent">{p.title}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </section>
        <aside className="flex flex-col gap-7">
          <section aria-label={`${game.shortName} in the forums`}>
            <h2 className="mb-2.5 text-[26px]">{game.shortName} in the forums</h2>
            {threads.map(t => (
              <div key={t.slug} className="border-t border-line py-2.5">
                <Link href={`/forums/${t.channel}/${t.slug}`} className="text-[15px] font-semibold hover:text-accent">{t.title}</Link>
              </div>
            ))}
            <div className="border-t border-line pt-2.5"><TextLink href={threads[0] ? `/forums/${threads[0].channel}` : '/forums/general'}>{threads.length ? 'More in the forums' : 'Start the conversation'}</TextLink></div>
          </section>
          <AdSlot size="300x250" />
        </aside>
      </Container>
    </>
  );
}
