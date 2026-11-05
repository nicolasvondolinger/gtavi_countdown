import { Status } from '@/components/ui/Status';
import { Votes } from '@/components/ui/Votes';
import { timeAgo } from '@/lib/format';
import type { getTheories } from '@/server/wiki/community';
import { TheoryForm } from './TheoryForm';

export function Theories({ theories, pageId, path }: { theories: Awaited<ReturnType<typeof getTheories>>; pageId: number; path: string }) {
  return (
    <section id="theories" aria-label="Theories" className="flex scroll-mt-6 flex-col">
      <h2 className="mb-3 text-[26px]">Theories</h2>
      {theories.length === 0 && <p className="pb-3 font-read text-[15px] text-muted">No theories yet.</p>}
      {theories.map((t, i) => {
        const pct = t.total ? Math.round((t.plausible / t.total) * 100) : 0;
        return (
          <details key={t.id} open={i === 0} className="border-t border-line py-3.5">
            <summary className="flex cursor-pointer list-none gap-4 [&::-webkit-details-marker]:hidden">
              <Votes kind="theory" id={t.id} score={t.score} />
              <span className="flex min-w-0 flex-1 flex-col gap-2">
                <span className="text-[17px] font-semibold">{t.title}</span>
                <span className="flex flex-wrap items-center gap-3">
                  <span aria-hidden="true" className="h-1 w-40 bg-raised"><span className="block h-full bg-theory" style={{ width: `${pct}%` }} /></span>
                  <span className="text-[13px] text-muted">{pct}% of {t.total.toLocaleString('en')} voters call it plausible</span>
                </span>
              </span>
            </summary>
            <div className="mt-2 flex flex-col gap-2 pl-10">
              <p className="font-read text-[15px]/[1.6] text-soft">{t.body}</p>
              <p className="text-[13px] text-muted">Proposed by {t.author ?? 'a former member'}, {timeAgo(t.createdAt)}</p>
              <Status kind="theory" />
            </div>
          </details>
        );
      })}
      <TheoryForm pageId={pageId} path={path} />
    </section>
  );
}
