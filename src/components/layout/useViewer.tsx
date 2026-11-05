'use client';

import { usePathname } from '@/i18n/navigation';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type ViewerSummary = { username: string; avatar: string; rep: number; role: string; level: number; onboarded: boolean; unread: number; reviewer: boolean; pending: number };

const ViewerContext = createContext<ViewerSummary | null | undefined>(undefined);

// Pages stay cacheable, so who is signed in is read in the browser. The layout outlives
// navigation, so this reads again on every route change: signing in or out moves the route.
export function ViewerProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [viewer, setViewer] = useState<ViewerSummary | null | undefined>(undefined);
  useEffect(() => {
    let live = true;
    fetch('/api/me')
      .then(r => r.json())
      .then((v: ViewerSummary | null) => live && setViewer(v))
      .catch(() => live && setViewer(null));
    return () => {
      live = false;
    };
  }, [pathname]);
  return <ViewerContext.Provider value={viewer}>{children}</ViewerContext.Provider>;
}

export const useViewer = () => useContext(ViewerContext);
