import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { slugify } from '@/lib/toc';

const text = (children: unknown) => String(Array.isArray(children) ? children.join('') : children);

// User text is rendered without raw HTML, so an edit cannot inject markup.
export function Markdown({ children }: { children: string }) {
  return (
    <div className="prose-wiki">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h2: ({ children: c }) => <h2 id={slugify(text(c))} className="scroll-mt-6">{c}</h2>,
          h3: ({ children: c }) => <h3 id={slugify(text(c))} className="scroll-mt-6">{c}</h3>,
          table: ({ children: c }) => <div className="overflow-x-auto"><table>{c}</table></div>,
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
