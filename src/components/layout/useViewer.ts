'use client';

import { useEffect, useState } from 'react';

export type ViewerSummary = { username: string; avatar: string; rep: number; level: number; onboarded: boolean };

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
