import { localizedMeta } from '@/i18n/page';
import { pageLocale, type LocaleParams } from '@/i18n/page';
import { getT } from '@/i18n/server';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Container } from '@/components/ui/Container';
import { Icon } from '@/components/ui/Icon';
import { getGames } from '@/server/wiki/queries';

export const revalidate = 300;
export const generateMetadata = localizedMeta({ title: 'All Grand Theft Auto games', description: 'Every Grand Theft Auto release since 1997, grouped by universe.' });

const UNIVERSES = [['hd', 'HD universe'], ['3d', '3D universe'], ['2d', '2D universe']] as const;

export default async function GamesPage({ params }: LocaleParams) {
  const locale = await pageLocale(params);
  const t = await getT();
  const games = await getGames(locale);
  const next = games.find(g => g.releaseAt);
  return (
    <>
      <Container className="mt-6 grid gap-6 lg:mt-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:gap-8">
        <div className="flex flex-col gap-3">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Games' }]} />
          <h1 className="text-[41px] lg:text-[72px]">{t('All Grand Theft Auto games')}</h1>
          <p className="font-read text-[15px]/[1.6] text-body lg:text-[17px]">{t('Every release since 1997, grouped the way the series groups them: each universe has its own continuity, so a Liberty City in one is not the same city in another.')}</p>
        </div>
        {next?.image && (
          <Link href={`/${next.slug}`} className="group hidden flex-col gap-2.5 lg:flex">
            <span className="relative aspect-[2/1] overflow-hidden rounded-image">
              <Image src={`/media/${next.image}`} alt="" fill sizes="30vw" className="object-cover" />
            </span>
            <span className="flex items-baseline justify-between">
              <span className="text-[17px] font-semibold group-hover:text-accent">{next.name}</span>
              <span className="font-data text-[15px] text-muted">{next.year}</span>
            </span>
          </Link>
        )}
      </Container>
      <Container className="mt-8 mb-16 flex flex-col gap-9 lg:mt-10 lg:mb-20">
        {UNIVERSES.map(([key, label]) => (
          <section key={key} aria-label={t(label)}>
            <h2 className="mb-2 text-[26px] lg:text-[33px]">{t(label)}</h2>
            <ul>
              {games.filter(g => g.universe === key).map(g => (
                <li key={g.slug} className="border-t border-line">
                  <Link href={`/${g.slug}`} className="group flex items-center gap-3 py-2.5 hover:bg-raised lg:gap-6 lg:px-3 lg:py-3">
                    <span className="min-w-0 flex-1 lg:contents">
                      <span className="block text-base font-semibold group-hover:text-accent lg:w-[300px] lg:shrink-0 lg:text-[17px]">{g.name}</span>
                      <span className="block text-[13px] text-muted lg:hidden">{g.setting}</span>
                    </span>
                    <span className="font-data text-[13px] text-muted lg:order-none lg:w-14 lg:shrink-0">{g.year}</span>
                    <span className="hidden flex-1 text-[15px] text-soft lg:block">{g.setting}</span>
                    <span className="hidden w-[300px] shrink-0 text-[15px] text-muted lg:block">{g.leads}</span>
                    <Icon name="chevronRight" className="shrink-0 text-muted" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </Container>
    </>
  );
}
