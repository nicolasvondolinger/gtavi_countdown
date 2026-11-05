'use client';

import { useT } from '@/i18n/t';
import { useState } from 'react';
import { reportContent } from '@/server/moderation/actions';

export function ReportButton({ kind, id, path }: { kind: 'comment' | 'post'; id: number; path: string }) {
  const t = useT();
  const [sent, setSent] = useState(false);
  if (sent) return <span className="text-[13px] text-dim">{t('Reported')}</span>;
  return (
    <form action={async form => { await reportContent(form); setSent(true); }}>
      <input type="hidden" name="kind" value={kind} />
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="path" value={path} />
      <button className="text-[13px] text-dim hover:text-text">{t('Report')}</button>
    </form>
  );
}
