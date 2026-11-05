import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { RoleForm } from '@/components/moderation/RoleForm';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { timeAgo } from '@/lib/format';
import { requireViewer } from '@/server/auth/session';
import { resolve } from '@/server/moderation/actions';
import { getReports } from '@/server/moderation/service';

export const metadata: Metadata = { title: 'Moderation', robots: { index: false } };

export default async function ModerationPage() {
  const viewer = await requireViewer('/moderation');
  if (viewer.profile.role !== 'moderator') redirect('/');
  const reports = await getReports();
  return (
    <Container className="mt-6 mb-16 flex max-w-[960px]! flex-col gap-8 lg:mt-8">
      <h1 className="text-[41px] lg:text-[56px]">Moderation</h1>
      <section aria-label="Reports" className="flex flex-col gap-3">
        <h2 className="text-[26px]">Reports</h2>
        {reports.length === 0 && <p className="font-read text-[15px] text-muted">Nothing is waiting.</p>}
        {reports.map(r => (
          <article key={`${r.kind}${r.id}`} className="flex flex-col gap-2 border-t border-line py-3">
            <p className="text-[13px] text-muted"><span className="font-data text-leak">{r.reports} {r.reports === 1 ? 'report' : 'reports'}</span> · {r.kind} by {r.author ?? 'a former member'} · {timeAgo(r.createdAt)} · <Link href={r.href} className="text-accent">Open</Link></p>
            <p className="font-read text-[15px]/[1.6] whitespace-pre-wrap text-body">{r.body}</p>
            <form action={resolve} className="flex gap-2.5">
              <input type="hidden" name="kind" value={r.kind} />
              <input type="hidden" name="id" value={r.id} />
              <input type="hidden" name="path" value={r.href} />
              <Button name="action" value="remove" className="px-3! py-1.5! text-sm!">Remove</Button>
              <Button name="action" value="dismiss" kind="secondary" className="px-3! py-1.5! text-sm!">Dismiss</Button>
            </form>
          </article>
        ))}
      </section>
      <section aria-label="Roles" className="flex flex-col gap-3">
        <h2 className="text-[26px]">Roles</h2>
        <p className="font-read text-[15px] text-muted">Reviewers vote on edits. Moderators also handle reports, pins and roles.</p>
        <RoleForm />
      </section>
    </Container>
  );
}
