import { CommentNode } from '@/components/discussion/CommentNode';
import type { Discussion } from '@/server/wiki/community';
import { ReportButton } from '@/components/discussion/ReportButton';
import { CommentForm } from './CommentForm';

export function Talk({ comments, pageId, path }: { comments: Discussion[]; pageId: number; path: string }) {
  return (
    <section id="talk" aria-label="Talk" className="flex scroll-mt-6 flex-col gap-5">
      <h2 className="text-[26px]">Talk</h2>
      <CommentForm pageId={pageId} path={path} />
      {comments.map(c => (
        <CommentNode
          key={c.id}
          node={c}
          kind="comment"
          actions={node => (
            <>
              <details>
                <summary className="cursor-pointer text-[13px] font-semibold text-muted">Reply</summary>
                <div className="mt-2 w-[min(520px,70vw)]"><CommentForm pageId={pageId} path={path} parentId={node.id} /></div>
              </details>
              <ReportButton kind="comment" id={node.id} path={path} />
            </>
          )}
        />
      ))}
    </section>
  );
}
