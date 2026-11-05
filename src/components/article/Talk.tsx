import { CommentNode } from '@/components/discussion/CommentNode';
import { reportComment } from '@/server/wiki/community-actions';
import type { Discussion } from '@/server/wiki/community';
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
              <form action={reportComment}>
                <input type="hidden" name="id" value={node.id} />
                <input type="hidden" name="path" value={path} />
                <button className="text-[13px] text-dim hover:text-text">Report</button>
              </form>
            </>
          )}
        />
      ))}
    </section>
  );
}
