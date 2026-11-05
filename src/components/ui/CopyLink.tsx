'use client';

import { useState } from 'react';
import { useT } from '@/i18n/t';
import { Button } from './Button';

export function CopyLink({ label }: { label?: string }) {
  const t = useT();
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return <Button type="button" kind="secondary" onClick={copy}>{copied ? t('Link copied') : (label ?? t('Copy link'))}</Button>;
}
