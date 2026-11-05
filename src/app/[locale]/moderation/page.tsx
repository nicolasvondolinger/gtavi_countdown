import { TimeAgo } from '@/components/ui/TimeAgo';
import { localizedMeta } from '@/i18n/page';
import { getT } from '@/i18n/server';
import { Link } from '@/i18n/navigation';
import { redirect } from 'next/navigation';
import { RoleForm } from '@/components/moderation/RoleForm';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { requireViewer } from '@/server/auth/session';
import { resolve } from '@/server/moderation/actions';
import { getReports } from '@/server/moderation/service';

export const generateMetadata = localizedMeta({ title: 'Moderation', robots: { index: false } });

export default async function ModerationPage() {
  const t = await getT();
  const viewer = await requireViewer('/moderation');
  if (viewer.profile.role !== 'moderator') redirect('/');
  const reports = await getReports();
  return (
    <Container className="mt-6 mb-16 flex max-w-[960px]! flex-col gap-8 lg:mt-8">
      <h1 className="text-[41px] lg:text-[56px]">{t('Moderation')}</h1>
      <section aria-label={t('Reports')} className="flex flex-col gap-3">
        <h2 className="text-[26px]">{t('Reports')}</h2>
        {reports.length === 0 && <p className="font-read text-[15px] text-muted">{t('Nothing is waiting.')}</p>}
        {reports.map(r => (
          <article key={`${r.kind}${r.id}`} className="flex flex-col gap-2 border-t border-line py-3">
            <p className="text-[13px] text-muted"><span className="font-data text-leak">{r.reports === 1 ? t('1 report') : t('{n} reports', { n: r.reports })}</span> · {t('{kind} by {author}', { kind: t(r.kind), author: r.author ?? t('a former member') })} · <TimeAgo date={r.createdAt} /> · <Link href={r.href} className="text-accent">{t('Open')}</Link></p>
            <p className="font-read text-[15px]/[1.6] whitespace-pre-wrap text-body">{r.body}</p>
            <form action={resolve} className="flex gap-2.5">
              <input type="hidden" name="kind" value={r.kind} />
              <input type="hidden" name="id" value={r.id} />
              <input type="hidden" name="path" value={r.href} />
              <Button name="action" value="remove" className="px-3! py-1.5! text-sm!">{t('Remove')}</Button>
              <Button name="action" value="dismiss" kind="secondary" className="px-3! py-1.5! text-sm!">{t('Dismiss')}</Button>
            </form>
          </article>
        ))}
      </section>
      <section aria-label={t('Roles')} className="flex flex-col gap-3">
        <h2 className="text-[26px]">{t('Roles')}</h2>
        <p className="font-read text-[15px] text-muted">{t('Reviewers vote on edits. Moderators also handle reports, pins and roles.')}</p>
        <RoleForm />
      </section>
    </Container>
  );
}
