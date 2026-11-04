import { Icon } from '@/components/ui/Icon';

export function SearchBox() {
  return (
    <form action="/search" role="search" className="flex w-[300px] items-center gap-2 rounded-control border border-line bg-surface px-2.5 py-2 focus-within:border-accent">
      <Icon name="search" className="text-muted" />
      <input name="q" aria-label="Search the wiki" placeholder="Search the wiki" className="min-w-0 flex-1 bg-transparent text-sm text-text outline-none placeholder:text-dim" />
    </form>
  );
}
