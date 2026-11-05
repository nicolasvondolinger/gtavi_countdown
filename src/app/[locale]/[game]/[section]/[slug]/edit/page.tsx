import { localizedMeta } from '@/i18n/page';
import { getT } from '@/i18n/server';
import { notFound } from 'next/navigation';
import { EditForm } from '@/components/article/EditForm';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Container } from '@/components/ui/Container';
import { isSection } from '@/lib/sections';
import { requireViewer } from '@/server/auth/session';
import { getPage } from '@/server/wiki/queries';

type Props = { params: Promise<{ locale: string; game: string; section: string; slug: string }> };

export const generateMetadata = localizedMeta({ title: 'Edit', robots: { index: false } });

export default async function EditPage({ params }: Props) {
  const t = await getT();
  const { locale, game, section, slug } = await params;
  const row = isSection(section) ? await getPage(game, section, slug, locale) : null;
  if (!row?.revision) notFound();
  const path = `/${game}/${section}/${slug}`;
  await requireViewer(`${path}/edit`);
  return (
    <Container className="mt-6 mb-16 flex max-w-[860px]! flex-col gap-4 lg:mt-8">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Games', href: '/games' }, { label: row.game.shortName, href: `/${game}` }, { label: row.page.title, href: path }, { label: 'Edit' }]} />
      <h1 className="text-[41px]">{t('Edit {title}', { title: row.page.title })}</h1>
      <EditForm pageId={row.page.id} baseRevisionId={row.revision.id} path={path} body={row.revision.body} />
    </Container>
  );
}
