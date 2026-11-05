import { TimeAgo } from '@/components/ui/TimeAgo';
import { useLocale } from 'next-intl';
import { useT } from '@/i18n/t';
import { number } from '@/lib/format';
import { Status } from '@/components/ui/Status';
import { Votes } from '@/components/ui/Votes';
import type { getTheories } from '@/server/wiki/community';
import { TheoryForm } from './TheoryForm';

export function Theories({ theories, pageId, path }: { theories: Awaited<ReturnType<typeof getTheories>>; pageId: number; path: string }) {
  const tr = useT();
  const locale = useLocale();
  return (
    <section id="theories" aria-label={tr('Theories')} className="flex scroll-mt-6 flex-col">
      <h2 className="mb-3 text-[26px]">{tr('Theories')}</h2>
      {theories.length === 0 && <p className="pb-3 font-read text-[15px] text-muted">{tr('No theories yet.')}</p>}
      {theories.map((t, i) => {
        const pct = t.total ? Math.round((t.plausible / t.total) * 100) : 0;
        return (
          <div key={t.id} className="flex gap-4 border-t border-line py-3.5">
            <Votes kind="theory" id={t.id} score={t.score} />
            <details open={i === 0} className="min-w-0 flex-1">
            <summary className="flex cursor-pointer list-none [&::-webkit-details-marker]:hidden">
              <span className="flex min-w-0 flex-1 flex-col gap-2">
                <span className="text-[17px] font-semibold">{t.title}</span>
                <span className="flex flex-wrap items-center gap-3">
                  <span aria-hidden="true" className="h-1 w-40 bg-raised"><span className="block h-full bg-theory" style={{ width: `${pct}%` }} /></span>
                  <span className="text-[13px] text-muted">{tr('{pct}% of {total} voters call it plausible', { pct, total: number(t.total, locale) })}</span>
                </span>
              </span>
            </summary>
            <div className="mt-2 flex flex-col gap-2">
              <p className="font-read text-[15px]/[1.6] text-soft">{t.body}</p>
              <p className="text-[13px] text-muted">{tr('Proposed by {author}', { author: t.author ?? tr('a former member') })}, <TimeAgo date={t.createdAt} /></p>
              <Status kind="theory" />
            </div>
            </details>
          </div>
        );
      })}
      <TheoryForm pageId={pageId} path={path} />
    </section>
  );
}
