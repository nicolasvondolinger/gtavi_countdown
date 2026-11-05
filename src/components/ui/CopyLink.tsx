'use client';

import { useState } from 'react';
import { Button } from './Button';

export function CopyLink({ label = 'Copy link' }: { label?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return <Button type="button" kind="secondary" onClick={copy}>{copied ? 'Link copied' : label}</Button>;
}
