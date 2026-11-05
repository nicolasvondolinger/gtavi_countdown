'use client';

import { useEffect, useState } from 'react';

export type ViewerSummary = { username: string; avatar: string; rep: number; role: string; level: number; onboarded: boolean; unread: number; reviewer: boolean; pending: number };

// Pages stay cacheable, so who is signed in is read in the browser.
export function useViewer() {
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
  }, []);
  return viewer;
}
