'use client';

import { useSyncExternalStore } from 'react';
import { Icon } from '@/components/ui/Icon';
import { useT } from '@/i18n/t';
import { THEME_KEY } from './theme';

type Theme = 'light' | 'dark';

const listeners = new Set<() => void>();
const read = (): Theme => (document.documentElement.dataset.theme === 'light' ? 'light' : 'dark');
const subscribe = (fn: () => void) => {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
};

export function ThemeToggle({ withLabel }: { withLabel?: boolean }) {
  const t = useT();
  const theme = useSyncExternalStore(subscribe, read, () => 'dark');
  const next: Theme = theme === 'dark' ? 'light' : 'dark';
  const label = next === 'light' ? t('Switch to light theme') : t('Switch to dark theme');
  const change = () => {
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      // Without storage the choice lasts until the page reloads.
    }
    listeners.forEach(fn => fn());
  };
  return (
    <button type="button" onClick={change} aria-label={withLabel ? undefined : label} title={withLabel ? undefined : label} className="flex shrink-0 items-center gap-2 text-muted hover:text-text">
      <Icon name={next === 'light' ? 'sun' : 'moon'} size={22} />
      {withLabel && <span className="text-base text-soft">{label}</span>}
    </button>
  );
}
