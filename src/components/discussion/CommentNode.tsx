import { TimeAgo } from '@/components/ui/TimeAgo';
import { useT } from '@/i18n/t';
import { Avatar } from '@/components/ui/Avatar';
import { Votes } from '@/components/ui/Votes';
import type { VoteKind } from '@/server/votes';
import type { Discussion } from '@/server/wiki/community';
import type { ReactNode } from 'react';

const ROLE: Record<string, string> = { moderator: 'Moderator', reviewer: 'Reviewer', member: 'Member' };

export function CommentNode({ node, kind, depth = 0, actions }: { node: Discussion; kind: VoteKind; depth?: number; actions?: (node: Discussion) => ReactNode }) {
  const t = useT();
  return (
    <div className="flex gap-3">
      <Avatar avatar={node.avatar} size={depth ? 28 : 34} />
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <p className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold">{node.author ?? t('Former member')}</span>
          {node.role && <span className="text-[13px] text-muted">{t(ROLE[node.role] ?? node.role)}</span>}
          <span className="text-[13px] text-dim"><TimeAgo date={node.createdAt} /></span>
        </p>
        {node.spoiler ? (
          <details className="rounded-control bg-surface px-3 py-2">
            <summary className="cursor-pointer text-sm font-semibold">{t('Spoiler: show this reply')}</summary>
            <p className="mt-2 font-read text-[15px]/[1.6] whitespace-pre-wrap text-body">{node.body}</p>
          </details>
        ) : (
          <p className="font-read text-[15px]/[1.6] whitespace-pre-wrap text-body">{node.body}</p>
        )}
        <div className="flex items-center gap-4.5">
          <Votes kind={kind} id={node.id} score={node.score} row />
          {actions?.(node)}
        </div>
        {node.replies.length > 0 && (
          <div className="mt-2 flex flex-col gap-4 border-l border-line pl-3 lg:pl-4">
            {node.replies.map(r => <CommentNode key={r.id} node={r} kind={kind} depth={depth + 1} actions={actions} />)}
          </div>
        )}
      </div>
    </div>
  );
}
