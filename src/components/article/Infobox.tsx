import Image from 'next/image';
import { LoopVideo } from '@/components/ui/LoopVideo';
import { Status } from '@/components/ui/Status';
import { useT } from '@/i18n/t';
import type { schema } from '@/server/db';

type Page = typeof schema.pages.$inferSelect;
type Game = typeof schema.games.$inferSelect;

function Rows({ page }: { page: Page }) {
  return (
    <dl>
      {page.infobox.map(row => (
        <div key={row.label} className="flex gap-3 border-t border-line px-3.5 py-2.5">
          <dt className="w-[110px] shrink-0 text-sm text-muted">{row.label}</dt>
          <dd className="flex min-w-0 flex-col gap-1 text-sm font-semibold">
            {row.value}
            {row.status && <Status kind={row.status} />}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function Infobox({ page, game }: { page: Page; game: Game }) {
  const t = useT();
  const hasContent = page.infobox.length > 0 || page.image;
  if (!hasContent) return null;
  return (
    <>
      <details open className="group overflow-hidden rounded-panel border border-line bg-surface lg:hidden">
        <summary className="flex cursor-pointer list-none items-center gap-3 p-3 [&::-webkit-details-marker]:hidden">
          {page.image && (
            <span className="relative size-14 shrink-0 overflow-hidden rounded-image">
              <Image src={`/media/${page.image}`} alt="" fill sizes="56px" className="object-cover" />
            </span>
          )}
          <span className="flex-1">
            <span className="block text-[15px] font-semibold">{t('Infobox')}</span>
            <span className="text-[13px] text-muted">{t('{n} facts', { n: page.infobox.length })}</span>
          </span>
          <span aria-hidden="true" className="text-xl transition-transform duration-150 group-open:rotate-180">⌄</span>
        </summary>
        <Rows page={page} />
      </details>
      <aside aria-label={t('Infobox')} className="hidden overflow-hidden rounded-panel border border-line bg-surface lg:block">
        <div className="flex flex-col gap-0.5 px-3.5 py-3">
          <p className="font-display text-[26px] leading-tight font-semibold">{page.title}</p>
          <p className="text-[13px] text-muted">{game.name}</p>
        </div>
        {page.video ? (
          <div className="relative aspect-[9/8]"><LoopVideo name={page.video} alt={page.title} sizes="340px" /></div>
        ) : (
          page.image && (
            <div className="relative aspect-[9/8]">
              <Image src={`/media/${page.image}`} alt={page.title} fill sizes="340px" className="object-cover" />
            </div>
          )
        )}
        <Rows page={page} />
      </aside>
    </>
  );
}
