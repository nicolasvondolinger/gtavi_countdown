'use client';

import { useT } from '@/i18n/t';
import { usePathname, useRouter } from '@/i18n/navigation';
import { createContext, useContext, useEffect, useMemo, useState, useTransition, type ReactNode } from 'react';
import { compact } from '@/lib/format';
import { castVote, loadMyVotes } from '@/server/votes-actions';
import type { VoteKind } from '@/server/votes';
import { Icon } from './Icon';

const MineContext = createContext<Record<string, number>>({});

// Pages are cached, so the viewer's own votes load in the browser.
export function MyVotes({ ids, children }: { ids: Partial<Record<VoteKind, number[]>>; children: ReactNode }) {
  const [mine, setMine] = useState<Record<string, number>>({});
  const key = JSON.stringify(ids);
  useEffect(() => {
    loadMyVotes(JSON.parse(key) as typeof ids).then(setMine).catch(() => {});
  }, [key]);
  return <MineContext.Provider value={mine}>{children}</MineContext.Provider>;
}

export function Votes({ kind, id, score, row }: { kind: VoteKind; id: number; score: number; row?: boolean }) {
  const t = useT();
  const router = useRouter();
  const pathname = usePathname();
  const loaded = useContext(MineContext)[`${kind}:${id}`] ?? 0;
  const [override, setOverride] = useState<{ mine: number; score: number } | null>(null);
  const [pending, start] = useTransition();
  const mine = override?.mine ?? loaded;
  const shown = useMemo(() => override?.score ?? score, [override, score]);

  const send = (value: 1 | -1) =>
    start(async () => {
      const result = await castVote({ kind, id, value });
      if ('signedOut' in result) router.push(`/signin?next=${encodeURIComponent(pathname)}`);
      else setOverride(result);
    });

  return (
    <div className={`flex items-center gap-0.5 ${row ? '' : 'flex-col'}`}>
      <button type="button" disabled={pending} onClick={() => send(1)} aria-label={t('Vote up')} aria-pressed={mine === 1} className={mine === 1 ? 'text-accent' : 'text-muted hover:text-text'}>
        <Icon name="arrowUp" />
      </button>
      <span className={`font-data text-[13px] font-bold ${mine === 1 ? 'text-accent' : ''}`}>{compact(shown)}</span>
      <button type="button" disabled={pending} onClick={() => send(-1)} aria-label={t('Vote down')} aria-pressed={mine === -1} className={mine === -1 ? 'text-accent' : 'text-muted hover:text-text'}>
        <Icon name="arrowDown" />
      </button>
    </div>
  );
}
