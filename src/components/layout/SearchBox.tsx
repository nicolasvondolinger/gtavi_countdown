'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { Tag } from '@/components/ui/Tag';
import type { Suggestion } from '@/server/search/queries';

export function SearchBox({ wide, initial = '' }: { wide?: boolean; initial?: string }) {
  const router = useRouter();
  const [q, setQ] = useState(initial);
  const [items, setItems] = useState<Suggestion[]>([]);
  const [active, setActive] = useState(-1);
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const term = q.trim();
    if (term.length < 2) return;
    const ctrl = new AbortController();
    const id = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search/suggest?q=${encodeURIComponent(term)}`, { signal: ctrl.signal });
        const data = (await res.json()) as { suggestions: Suggestion[] };
        setItems(data.suggestions);
        setActive(-1);
      } catch {
        // A cancelled or failed lookup leaves the current suggestions in place.
      }
    }, 150);
    return () => {
      clearTimeout(id);
      ctrl.abort();
    };
  }, [q]);

  const shown = open && q.trim().length >= 2 && items.length > 0;
  const go = (href: string) => {
    setOpen(false);
    router.push(href);
  };
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') setOpen(false);
    if (!shown) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive(i => (i + 1) % (items.length + 1));
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive(i => (i <= 0 ? items.length : i - 1));
    }
    const picked = items.at(active);
    if (e.key === 'Enter' && active >= 0 && picked && active < items.length) {
      e.preventDefault();
      go(picked.href);
    }
  };

  return (
    <form
      ref={box}
      action="/search"
      role="search"
      onSubmit={e => {
        e.preventDefault();
        if (q.trim()) go(`/search?q=${encodeURIComponent(q.trim())}`);
      }}
      onBlur={e => {
        if (!box.current?.contains(e.relatedTarget)) setOpen(false);
      }}
      className={`relative ${wide ? 'w-full' : 'w-[300px]'}`}
    >
      <div className="flex items-center gap-2 rounded-control border border-line bg-surface px-2.5 py-2 focus-within:border-accent">
        <Icon name="search" className="shrink-0 text-muted" />
        <input
          name="q"
          value={q}
          onChange={e => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKey}
          role="combobox"
          aria-expanded={shown}
          aria-controls="search-suggestions"
          aria-autocomplete="list"
          aria-activedescendant={active >= 0 ? `suggestion-${active}` : undefined}
          aria-label="Search the wiki"
          placeholder="Search the wiki"
          autoComplete="off"
          className="min-w-0 flex-1 bg-transparent text-sm text-text outline-none placeholder:text-dim"
        />
      </div>
      {shown && (
        <ul id="search-suggestions" role="listbox" aria-label="Suggestions" className="absolute inset-x-0 top-full z-50 mt-1 min-w-[320px] rounded-panel border border-edge bg-bg p-1.5 shadow-[0_12px_32px_#00000099]">
          {items.map((s, i) => (
            <li key={s.href} id={`suggestion-${i}`} role="option" aria-selected={i === active}>
              <button type="button" onClick={() => go(s.href)} className={`flex w-full items-center gap-3 rounded-control px-2 py-2 text-left hover:bg-raised ${i === active ? 'bg-raised' : ''}`}>
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-[15px] font-semibold">{s.title}</span>
                  <span className="text-[13px] text-muted">{s.category}</span>
                </span>
                {s.game && <Tag>{s.game}</Tag>}
              </button>
            </li>
          ))}
          <li role="option" aria-selected={active === items.length} className="mt-1 border-t border-line">
            <button type="button" onClick={() => go(`/search?q=${encodeURIComponent(q.trim())}`)} className={`w-full px-2 py-2.5 text-left text-sm font-semibold text-accent ${active === items.length ? 'bg-raised' : ''}`}>
              All results in every game
            </button>
          </li>
        </ul>
      )}
    </form>
  );
}
